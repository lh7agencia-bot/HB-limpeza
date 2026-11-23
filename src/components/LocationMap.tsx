import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, ExternalLink } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';

export function LocationMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const [lat, lng] = BUSINESS_INFO.coordinates;

    const map = L.map(container, {
      center: [lat, lng],
      zoom: 17,
      scrollWheelZoom: false,
    });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom SVG divIcon so Vite bundle never breaks default Leaflet PNG marker paths
    const pinIcon = L.divIcon({
      className: 'hb-custom-map-pin',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
          <div style="background:#0B3D91;color:#FFFFFF;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:11px;padding:4px 8px;border-radius:6px;white-space:nowrap;box-shadow:0 4px 10px rgba(0,0,0,0.22);border:1.5px solid #FFFFFF;margin-bottom:4px;">
            HB Limpeza
          </div>
          <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16C0 27.25 16 38 16 38C16 38 32 27.25 32 16C32 7.163 24.837 0 16 0Z" fill="#E63946"/>
            <circle cx="16" cy="15" r="6.5" fill="#FFFFFF"/>
            <circle cx="16" cy="15" r="3.2" fill="#0B3D91"/>
          </svg>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: [0, -68],
    });

    const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
    marker.bindPopup(
      `<div style="font-family:'DM Sans',sans-serif;min-width:210px;line-height:1.45;">
        <strong style="color:#0B3D91;font-size:13px;display:block;margin-bottom:4px;">${BUSINESS_INFO.name}</strong>
        <span style="color:#E63946;font-weight:600;font-size:11px;display:block;margin-bottom:4px;">${BUSINESS_INFO.landmark}</span>
        <span style="color:#334155;font-size:12px;">Av. Mato Grosso, 206 - A<br/>Jundiaí, Anápolis - GO, 75113-170</span>
      </div>`
    );
    marker.openPopup();
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    if (!map) return;
    map.setView(BUSINESS_INFO.coordinates, 17, { animate: true });
    marker?.openPopup();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-200">
        <div>
          <h3 className="font-display text-base font-bold text-[#0B3D91]">
            Nossa Localização em Anápolis
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            {BUSINESS_INFO.landmark} · Bairro Jundiaí
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRecenter}
            aria-label="Centralizar mapa no endereço da HB Limpeza"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#0B3D91] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LocateFixed className="w-3.5 h-3.5" aria-hidden="true" />
            Centralizar
          </button>

          <a
            href={BUSINESS_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B3D91] text-white text-xs font-semibold hover:bg-[#072A66] transition-colors whitespace-nowrap shrink-0"
          >
            Ver Rota
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div
        ref={mapContainerRef}
        data-testid="leaflet-map"
        className="w-full h-[300px] sm:h-[340px] z-0 bg-slate-100"
        aria-label={`Mapa interativo centrado em ${BUSINESS_INFO.address}`}
      />
    </div>
  );
}
