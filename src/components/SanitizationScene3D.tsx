import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Layers, RotateCcw, Eye } from 'lucide-react';
import { buildCleaningEquipment, type FinishMode } from '../three/buildCleaningEquipment';

type CameraPreset = 'overview' | 'motor' | 'nozzle';

interface PresetConfig {
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: Record<CameraPreset, PresetConfig> = {
  overview: {
    label: 'Vista Geral',
    position: [3.45, 2.3, 3.95],
    target: [0.22, 0.58, 0.05],
  },
  motor: {
    label: 'Motor e Filtro',
    position: [1.85, 2.15, 2.4],
    target: [0.0, 1.05, 0.08],
  },
  nozzle: {
    label: 'Bico Extrator',
    position: [2.55, 1.2, 2.25],
    target: [1.0, 0.38, 0.22],
  },
};

export function SanitizationScene3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>('overview');
  const [exploded, setExploded] = useState(false);
  const [finish, setFinish] = useState<FinishMode>('navy');
  const [controlsOpen, setControlsOpen] = useState(true);
  const [contextLost, setContextLost] = useState(false);

  // Mutable ref bridges so React state updates never re-initialize the WebGL scene
  const targetPresetRef = useRef<CameraPreset>('overview');
  const explodedRef = useRef(false);
  const finishRef = useRef<FinishMode>('navy');
  const cameraTransitionActiveRef = useRef(false);
  const requestRenderFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Software WebGL probe (renderer string only, never User-Agent)
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 520;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
      requestRenderFnRef.current?.();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const horizonColor = new THREE.Color('#EEF3FA');
    scene.background = horizonColor;
    scene.fog = new THREE.Fog(horizonColor, 9, 22);

    // Mandatory Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(...CAMERA_PRESETS.overview.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.overview.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2.0;
    controls.maxDistance = 7.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.update();

    // Warm key directional light + cool sky/ground HemisphereLight + rim highlight
    const hemiLight = new THREE.HemisphereLight('#DCEBFF', '#94A3B8', 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFF6EA', 2.1);
    keyLight.position.set(4.5, 6.2, 4.2);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 16;
      const d = 3.6;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#B8D4FF', 0.9);
    rimLight.position.set(-4, 3.5, -4);
    scene.add(rimLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const equipment = buildCleaningEquipment(maxAniso);
    scene.add(equipment.rootGroup);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Reusable scratch vectors (zero GC allocations during render)
    const _camGoalPos = new THREE.Vector3(...CAMERA_PRESETS.overview.position);
    const _camGoalTarget = new THREE.Vector3(...CAMERA_PRESETS.overview.target);

    let explodedAmount = 0;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function applyImmediateFinish(mode: FinishMode) {
      if (mode === 'navy') {
        equipment.primaryBodyMat.color.set('#0B3D91');
        equipment.primaryBodyMat.metalness = 0.18;
        equipment.primaryBodyMat.roughness = 0.26;
      } else {
        equipment.primaryBodyMat.color.set('#CBD5E1');
        equipment.primaryBodyMat.metalness = 0.86;
        equipment.primaryBodyMat.roughness = 0.2;
      }
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        renderDirty = false;
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        applyImmediateFinish(finishRef.current);

        // Smooth exploded-view layer separation
        const targetExplode = explodedRef.current ? 1 : 0;
        if (prefersReducedMotion) {
          explodedAmount = targetExplode;
        } else {
          explodedAmount = THREE.MathUtils.damp(explodedAmount, targetExplode, 7, dt);
        }

        equipment.filterCoreGroup.position.y = 0.96 + explodedAmount * 0.42;
        equipment.motorDomeGroup.position.y = 1.14 + explodedAmount * 0.86;
        equipment.wandGroup.position.x = explodedAmount * 0.34;

        const explodeSettled = Math.abs(explodedAmount - targetExplode) < 0.002;
        if (explodeSettled) explodedAmount = targetExplode;

        // Smooth camera preset transition (cancelled on arrival or user orbit start)
        let cameraSettled = true;
        if (cameraTransitionActiveRef.current) {
          const preset = CAMERA_PRESETS[targetPresetRef.current];
          _camGoalPos.set(...preset.position);
          _camGoalTarget.set(...preset.target);

          if (prefersReducedMotion) {
            camera.position.copy(_camGoalPos);
            controls.target.copy(_camGoalTarget);
            cameraTransitionActiveRef.current = false;
          } else {
            const alpha = 1 - Math.exp(-7 * dt);
            camera.position.lerp(_camGoalPos, alpha);
            controls.target.lerp(_camGoalTarget, alpha);
            if (
              camera.position.distanceTo(_camGoalPos) < 0.015 &&
              controls.target.distanceTo(_camGoalTarget) < 0.015
            ) {
              camera.position.copy(_camGoalPos);
              controls.target.copy(_camGoalTarget);
              cameraTransitionActiveRef.current = false;
            } else {
              cameraSettled = false;
            }
          }
        }

        const dampingActive = controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (
            renderDirty ||
            !explodeSettled ||
            !cameraSettled ||
            (!isSoftwareGl && dampingActive)
          ) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    requestRenderFnRef.current = requestRender;

    const handleControlStart = () => {
      cameraTransitionActiveRef.current = false;
    };
    const handleControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', handleControlStart);
    controls.addEventListener('change', handleControlChange);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    // Initial render
    requestRender();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', handleControlStart);
      controls.removeEventListener('change', handleControlChange);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      equipment.disposables.forEach((d) => d.dispose());
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      requestRenderFnRef.current = null;
    };
  }, []);

  const handleSelectPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    targetPresetRef.current = preset;
    cameraTransitionActiveRef.current = true;
    requestRenderFnRef.current?.();
  };

  const handleToggleExplode = () => {
    setExploded((prev) => {
      const next = !prev;
      explodedRef.current = next;
      requestRenderFnRef.current?.();
      return next;
    });
  };

  const handleSelectFinish = (mode: FinishMode) => {
    setFinish(mode);
    finishRef.current = mode;
    requestRenderFnRef.current?.();
  };

  const handleResetView = () => {
    setActivePreset('overview');
    setExploded(false);
    setFinish('navy');
    targetPresetRef.current = 'overview';
    explodedRef.current = false;
    finishRef.current = 'navy';
    cameraTransitionActiveRef.current = true;
    requestRenderFnRef.current?.();
  };

  return (
    <section
      id="equipamento-3d"
      aria-labelledby="heading-equipamento-3d"
      className="py-16 md:py-24 bg-[#F8FAFC] border-y border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#E63946] mb-2">
              Tecnologia e Equipamentos Profissionais
            </p>
            <h2
              id="heading-equipamento-3d"
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#0B3D91] text-balance"
            >
              Inspecione nosso sistema de extração e higienização em 3D
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-600 max-w-md">
            Arraste para girar o equipamento, alterne entre vistas técnicas ou abra as camadas internas de filtragem para conhecer o padrão que levamos até o seu ambiente.
          </p>
        </div>

        {/* 3D Viewport Container */}
        <div
          className="relative w-full h-[460px] md:h-[540px] rounded-2xl overflow-hidden border border-slate-200 bg-[#EEF3FA]"
          data-testid="scene-3d-container"
          data-view={activePreset}
          data-exploded={String(exploded)}
          data-finish={finish}
        >
          {/* Dedicated isolated canvas mount */}
          <div
            ref={mountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            aria-label="Visualização 3D interativa da extratora profissional da HB Limpeza e Higienização"
          />

          {/* Top-left quiet spec label (solid rgba surface, no backdrop-filter) */}
          <div className="pointer-events-none absolute top-4 left-4 rounded-lg bg-[#FFFFFF]/95 border border-slate-200 px-3.5 py-2 shadow-sm">
            <p className="text-xs font-semibold text-[#0B3D91]">
              Sistema HB Extração 8.5 BAR
            </p>
            <p className="text-xs text-slate-600">
              Arraste para rotacionar · Scroll para zoom
            </p>
          </div>

          {contextLost && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#EEF3FA] p-6 text-center">
              <div className="max-w-sm rounded-xl bg-white p-6 border border-slate-200">
                <p className="text-base font-semibold text-[#0B3D91] mb-2">
                  Visualização 3D pausada
                </p>
                <p className="text-sm text-slate-600">
                  O contexto gráfico foi temporariamente suspenso pelo navegador.
                </p>
              </div>
            </div>
          )}

          {/* Collapsible Bottom Control Dock (solid/rgba surface, NO backdrop-filter over WebGL) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center max-w-[94%]">
            <button
              type="button"
              onClick={() => setControlsOpen((o) => !o)}
              aria-expanded={controlsOpen}
              className="mb-1.5 inline-flex items-center gap-1.5 rounded-lg bg-[#0B3D91] text-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-[#072A66] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E63946]"
            >
              {controlsOpen ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  Ocultar Controles
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  Mostrar Controles
                </>
              )}
            </button>

            {controlsOpen && (
              <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-1.5 rounded-xl bg-white/95 border border-slate-200 px-2.5 py-1.5 shadow-sm">
                {/* Camera presets */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg" role="group" aria-label="Ângulos da câmera">
                  {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectPreset(key)}
                      aria-pressed={activePreset === key}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activePreset === key
                          ? 'bg-[#0B3D91] text-white'
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      {CAMERA_PRESETS[key].label}
                    </button>
                  ))}
                </div>

                {/* Exploded view toggle */}
                <button
                  type="button"
                  onClick={handleToggleExplode}
                  aria-pressed={exploded}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    exploded
                      ? 'bg-[#E63946] text-white border-[#E63946]'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-[#0B3D91]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                  {exploded ? 'Fechar Camadas' : 'Explodir Camadas'}
                </button>

                {/* Finish switch */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg" role="group" aria-label="Acabamento">
                  <button
                    type="button"
                    onClick={() => handleSelectFinish('navy')}
                    aria-pressed={finish === 'navy'}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      finish === 'navy'
                        ? 'bg-white text-[#0B3D91] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Azul HB
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectFinish('steel')}
                    aria-pressed={finish === 'steel'}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      finish === 'steel'
                        ? 'bg-white text-[#0B3D91] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Aço Inox
                  </button>
                </div>

                {/* Reset */}
                <button
                  type="button"
                  onClick={handleResetView}
                  aria-label="Resetar visualização 3D"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0B3D91] rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  Resetar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
