import * as THREE from 'three';

export type FinishMode = 'navy' | 'steel';

export interface EquipmentSceneHandles {
  rootGroup: THREE.Group;
  tankGroup: THREE.Group;
  filterCoreGroup: THREE.Group;
  motorDomeGroup: THREE.Group;
  wandGroup: THREE.Group;
  plinthMesh: THREE.Mesh;
  primaryBodyMat: THREE.MeshPhysicalMaterial;
  accentRedMat: THREE.MeshStandardMaterial;
  steelMat: THREE.MeshStandardMaterial;
  disposables: Array<{ dispose: () => void }>;
}

function createGaugeTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.arc(128, 128, 124, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#0B3D91';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(128, 128, 114, 0, Math.PI * 2);
  ctx.stroke();

  // Pressure arc
  ctx.strokeStyle = '#E63946';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(128, 128, 86, Math.PI * 0.75, Math.PI * 2.05);
  ctx.stroke();

  // Tick marks
  for (let i = 0; i <= 10; i++) {
    const angle = Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
    const x1 = 128 + Math.cos(angle) * 68;
    const y1 = 128 + Math.sin(angle) * 68;
    const x2 = 128 + Math.cos(angle) * 90;
    const y2 = 128 + Math.sin(angle) * 90;
    ctx.strokeStyle = i >= 8 ? '#E63946' : '#0F172A';
    ctx.lineWidth = i % 2 === 0 ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Labels
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HB PRO', 128, 102);
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#0B3D91';
  ctx.fillText('8.5 BAR', 128, 178);

  // Needle
  ctx.strokeStyle = '#E63946';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(128, 128);
  ctx.lineTo(182, 86);
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(128, 128, 10, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

function createTileBumpTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#EAEAEA';
  ctx.fillRect(0, 0, 256, 256);

  // Subtle tile micro-texture
  for (let i = 0; i < 1200; i++) {
    const x = (i * 73) % 256;
    const y = (i * 137) % 256;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(200,200,200,0.2)';
    ctx.fillRect(x, y, 2, 2);
  }

  // Tile grout lines
  ctx.strokeStyle = '#999999';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 252, 252);
  ctx.beginPath();
  ctx.moveTo(128, 0);
  ctx.lineTo(128, 256);
  ctx.moveTo(0, 128);
  ctx.lineTo(256, 128);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 14, 128, 128, 124);
  grad.addColorStop(0, 'rgba(11, 25, 56, 0.52)');
  grad.addColorStop(0.55, 'rgba(11, 25, 56, 0.18)');
  grad.addColorStop(1, 'rgba(11, 25, 56, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function buildCleaningEquipment(maxAnisotropy: number): EquipmentSceneHandles {
  const disposables: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const rootGroup = new THREE.Group();
  rootGroup.name = 'hb_extractor_unit';

  // Calibrated PBR materials
  const primaryBodyMat = track(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0B3D91'),
      roughness: 0.26,
      metalness: 0.18,
      clearcoat: 0.72,
      clearcoatRoughness: 0.16,
    })
  );

  const accentRedMat = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E63946'),
      roughness: 0.34,
      metalness: 0.12,
    })
  );

  const darkChassisMat = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E293B'),
      roughness: 0.68,
      metalness: 0.22,
    })
  );

  const rubberMat = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0F172A'),
      roughness: 0.88,
      metalness: 0.04,
    })
  );

  const steelMat = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E2E8F0'),
      roughness: 0.22,
      metalness: 0.88,
    })
  );

  const hoseMat = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#334155'),
      roughness: 0.75,
      metalness: 0.08,
    })
  );

  const nozzleClearMat = track(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#DCEBFF'),
      roughness: 0.12,
      metalness: 0.05,
      transparent: true,
      opacity: 0.55,
    })
  );

  const gaugeTex = track(createGaugeTexture(maxAnisotropy));
  const gaugeFaceMat = track(
    new THREE.MeshStandardMaterial({
      map: gaugeTex,
      roughness: 0.25,
      metalness: 0.05,
    })
  );

  const tileBumpTex = track(createTileBumpTexture(maxAnisotropy));
  const plinthMat = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F1F5F9'),
      roughness: 0.42,
      metalness: 0.06,
      bumpMap: tileBumpTex,
      bumpScale: 0.015,
    })
  );

  // Studio plinth (grounded at y = 0 top face)
  const plinthGeo = track(new THREE.CylinderGeometry(3.2, 3.35, 0.14, 48));
  const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
  plinthMesh.position.y = -0.07;
  plinthMesh.receiveShadow = true;
  rootGroup.add(plinthMesh);

  // Soft radial contact shadow disc
  const shadowTex = track(createContactShadowTexture());
  const shadowGeo = track(new THREE.CircleGeometry(1.75, 48));
  const shadowMat = track(
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.45,
    })
  );
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.set(0.08, 0.015, 0);
  rootGroup.add(shadowDisc);

  // 1. Base chassis deck (beveled ExtrudeGeometry, grounded flush via wheels)
  const deckShape = new THREE.Shape();
  const w = 0.72;
  const d = 0.88;
  const r = 0.18;
  deckShape.moveTo(-w + r, -d);
  deckShape.lineTo(w - r, -d);
  deckShape.quadraticCurveTo(w, -d, w, -d + r);
  deckShape.lineTo(w, d - r);
  deckShape.quadraticCurveTo(w, d, w - r, d);
  deckShape.lineTo(-w + r, d);
  deckShape.quadraticCurveTo(-w, d, -w, d - r);
  deckShape.lineTo(-w, -d + r);
  deckShape.quadraticCurveTo(-w, -d, -w + r, -d);

  const deckGeo = track(
    new THREE.ExtrudeGeometry(deckShape, {
      depth: 0.11,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
    })
  );
  deckGeo.rotateX(Math.PI / 2);
  const deckMesh = new THREE.Mesh(deckGeo, darkChassisMat);
  deckMesh.position.set(0, 0.28, 0);
  deckMesh.castShadow = true;
  deckMesh.receiveShadow = true;
  rootGroup.add(deckMesh);

  // 2. Wheels (4 wheels: 2 large rear wheels, 2 front caster wheels)
  const rearWheelGeo = track(new THREE.CylinderGeometry(0.22, 0.22, 0.09, 28));
  rearWheelGeo.rotateZ(Math.PI / 2);
  const rearHubGeo = track(new THREE.CylinderGeometry(0.11, 0.11, 0.105, 20));
  rearHubGeo.rotateZ(Math.PI / 2);

  [-0.78, 0.78].forEach((xSide) => {
    const wheel = new THREE.Mesh(rearWheelGeo, rubberMat);
    wheel.position.set(xSide, 0.22, -0.58);
    wheel.castShadow = true;
    rootGroup.add(wheel);

    const hub = new THREE.Mesh(rearHubGeo, steelMat);
    hub.position.set(xSide, 0.22, -0.58);
    rootGroup.add(hub);
  });

  const frontWheelGeo = track(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 20));
  frontWheelGeo.rotateZ(Math.PI / 2);
  const casterForkGeo = track(new THREE.BoxGeometry(0.08, 0.12, 0.08));

  [-0.5, 0.5].forEach((xSide) => {
    const wheel = new THREE.Mesh(frontWheelGeo, rubberMat);
    wheel.position.set(xSide, 0.11, 0.62);
    wheel.castShadow = true;
    rootGroup.add(wheel);

    const fork = new THREE.Mesh(casterForkGeo, steelMat);
    fork.position.set(xSide, 0.16, 0.62);
    rootGroup.add(fork);
  });

  // 3. Push handle (TubeGeometry curved industrial handlebar)
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.58, 0.34, -0.76),
    new THREE.Vector3(-0.58, 1.38, -0.94),
    new THREE.Vector3(-0.35, 1.54, -1.0),
    new THREE.Vector3(0.35, 1.54, -1.0),
    new THREE.Vector3(0.58, 1.38, -0.94),
    new THREE.Vector3(0.58, 0.34, -0.76),
  ]);
  const handleGeo = track(new THREE.TubeGeometry(handleCurve, 44, 0.036, 12, false));
  const handleMesh = new THREE.Mesh(handleGeo, steelMat);
  handleMesh.castShadow = true;
  rootGroup.add(handleMesh);

  // Grip sleeve on handle top
  const gripGeo = track(new THREE.CylinderGeometry(0.048, 0.048, 0.66, 18));
  gripGeo.rotateZ(Math.PI / 2);
  const gripMesh = new THREE.Mesh(gripGeo, accentRedMat);
  gripMesh.position.set(0, 1.54, -1.0);
  gripMesh.castShadow = true;
  rootGroup.add(gripMesh);

  // 4. Primary Solution & Recovery Tank Group (LatheGeometry)
  const tankGroup = new THREE.Group();
  tankGroup.position.set(0, 0.3, 0.06);

  const tankPoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.56, 0.0),
    new THREE.Vector2(0.6, 0.08),
    new THREE.Vector2(0.6, 0.68),
    new THREE.Vector2(0.55, 0.74),
    new THREE.Vector2(0.58, 0.79),
    new THREE.Vector2(0.52, 0.84),
    new THREE.Vector2(0.0, 0.84),
  ];
  const tankGeo = track(new THREE.LatheGeometry(tankPoints, 36));
  const tankMesh = new THREE.Mesh(tankGeo, primaryBodyMat);
  tankMesh.castShadow = true;
  tankMesh.receiveShadow = true;
  tankGroup.add(tankMesh);

  // Front intake port collar (red accent)
  const portGeo = track(new THREE.CylinderGeometry(0.11, 0.13, 0.14, 24));
  portGeo.rotateX(Math.PI / 2);
  const portMesh = new THREE.Mesh(portGeo, accentRedMat);
  portMesh.position.set(0, 0.52, 0.61);
  portMesh.castShadow = true;
  tankGroup.add(portMesh);

  // Side stainless latch clamps
  const clampGeo = track(new THREE.BoxGeometry(0.06, 0.16, 0.09));
  [-0.59, 0.59].forEach((x) => {
    const clamp = new THREE.Mesh(clampGeo, steelMat);
    clamp.position.set(x, 0.78, 0);
    tankGroup.add(clamp);
  });

  rootGroup.add(tankGroup);

  // 5. Internal HEPA / Hydro-Filtration Core Group (visible in exploded view)
  const filterCoreGroup = new THREE.Group();
  filterCoreGroup.position.set(0, 0.96, 0.06);

  const filterDrumGeo = track(new THREE.CylinderGeometry(0.32, 0.32, 0.36, 28));
  const filterDrumMesh = new THREE.Mesh(filterDrumGeo, steelMat);
  filterDrumMesh.castShadow = true;
  filterCoreGroup.add(filterDrumMesh);

  const filterSealGeo = track(new THREE.TorusGeometry(0.33, 0.032, 12, 32));
  filterSealGeo.rotateX(Math.PI / 2);
  const filterSealTop = new THREE.Mesh(filterSealGeo, accentRedMat);
  filterSealTop.position.y = 0.18;
  filterCoreGroup.add(filterSealTop);

  const filterSealBot = new THREE.Mesh(filterSealGeo, accentRedMat);
  filterSealBot.position.y = -0.18;
  filterCoreGroup.add(filterSealBot);

  rootGroup.add(filterCoreGroup);

  // 6. Upper Motor Dome, Control Console & Pressure Gauge Group
  const motorDomeGroup = new THREE.Group();
  motorDomeGroup.position.set(0, 1.14, 0.06);

  const domePoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.55, 0.0),
    new THREE.Vector2(0.57, 0.08),
    new THREE.Vector2(0.5, 0.34),
    new THREE.Vector2(0.38, 0.44),
    new THREE.Vector2(0.0, 0.46),
  ];
  const domeGeo = track(new THREE.LatheGeometry(domePoints, 36));
  const domeMesh = new THREE.Mesh(domeGeo, darkChassisMat);
  domeMesh.castShadow = true;
  motorDomeGroup.add(domeMesh);

  // Navy crown collar
  const crownGeo = track(new THREE.CylinderGeometry(0.39, 0.44, 0.09, 32));
  const crownMesh = new THREE.Mesh(crownGeo, primaryBodyMat);
  crownMesh.position.y = 0.38;
  motorDomeGroup.add(crownMesh);

  // Front Red Control Bezel
  const bezelGeo = track(new THREE.BoxGeometry(0.46, 0.17, 0.14));
  const bezelMesh = new THREE.Mesh(bezelGeo, accentRedMat);
  bezelMesh.position.set(0, 0.24, 0.45);
  bezelMesh.rotation.x = -0.28;
  bezelMesh.castShadow = true;
  motorDomeGroup.add(bezelMesh);

  // Pressure Gauge Housing + Dial Face
  const gaugeRingGeo = track(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 24));
  gaugeRingGeo.rotateX(Math.PI / 2);
  const gaugeRingMesh = new THREE.Mesh(gaugeRingGeo, steelMat);
  gaugeRingMesh.position.set(-0.1, 0.25, 0.51);
  gaugeRingMesh.rotation.x = -0.28;
  motorDomeGroup.add(gaugeRingMesh);

  const gaugeFaceGeo = track(new THREE.CircleGeometry(0.092, 24));
  const gaugeFaceMesh = new THREE.Mesh(gaugeFaceGeo, gaugeFaceMat);
  gaugeFaceMesh.position.set(-0.1, 0.26, 0.542);
  gaugeFaceMesh.rotation.x = -0.28;
  motorDomeGroup.add(gaugeFaceMesh);

  // Power switches on bezel
  const switchGeo = track(new THREE.BoxGeometry(0.055, 0.075, 0.04));
  [0.07, 0.15].forEach((sx) => {
    const sw = new THREE.Mesh(switchGeo, darkChassisMat);
    sw.position.set(sx, 0.25, 0.515);
    sw.rotation.x = -0.28;
    motorDomeGroup.add(sw);
  });

  rootGroup.add(motorDomeGroup);

  // 7. Extraction Hose & Stainless Spray Wand Group
  const wandGroup = new THREE.Group();

  const hoseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.82, 0.68),
    new THREE.Vector3(0.28, 0.62, 1.05),
    new THREE.Vector3(0.86, 0.18, 1.15),
    new THREE.Vector3(1.16, 0.42, 0.65),
    new THREE.Vector3(1.06, 0.92, 0.22),
  ]);
  const hoseGeo = track(new THREE.TubeGeometry(hoseCurve, 48, 0.042, 12, false));
  const hoseMesh = new THREE.Mesh(hoseGeo, hoseMat);
  hoseMesh.castShadow = true;
  wandGroup.add(hoseMesh);

  // Stainless steel lance shaft
  const lanceGeo = track(new THREE.CylinderGeometry(0.026, 0.026, 1.15, 16));
  const lanceMesh = new THREE.Mesh(lanceGeo, steelMat);
  lanceMesh.position.set(1.06, 0.58, 0.22);
  lanceMesh.rotation.z = 0.08;
  lanceMesh.castShadow = true;
  wandGroup.add(lanceMesh);

  // Red trigger valve on wand grip
  const valveGeo = track(new THREE.BoxGeometry(0.08, 0.14, 0.09));
  const valveMesh = new THREE.Mesh(valveGeo, accentRedMat);
  valveMesh.position.set(1.03, 0.98, 0.22);
  wandGroup.add(valveMesh);

  // Transparent wide upholstery/floor extraction head
  const headGeo = track(new THREE.BoxGeometry(0.32, 0.08, 0.14));
  const headMesh = new THREE.Mesh(headGeo, nozzleClearMat);
  headMesh.position.set(1.1, 0.07, 0.22);
  headMesh.rotation.z = 0.08;
  wandGroup.add(headMesh);

  rootGroup.add(wandGroup);

  return {
    rootGroup,
    tankGroup,
    filterCoreGroup,
    motorDomeGroup,
    wandGroup,
    plinthMesh,
    primaryBodyMat,
    accentRedMat,
    steelMat,
    disposables,
  };
}
