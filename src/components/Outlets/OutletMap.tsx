import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Outlet } from '../../types';
import { MapPin, Navigation, Building2, Phone, AlertTriangle, ExternalLink } from 'lucide-react';

interface OutletMapProps {
  outlets: Outlet[];
  selectedOutlet: Outlet | null;
  onSelectOutlet: (outlet: Outlet) => void;
}

export const OutletMap: React.FC<OutletMapProps> = ({
  outlets,
  selectedOutlet,
  onSelectOutlet,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapInstance = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapInstance.current) {
      // Initialize map centered on US
      const map = L.map(mapRef.current, {
        center: [39.8283, -98.5795], // Center US
        zoom: 4,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      leafletMapInstance.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = leafletMapInstance.current;
    const markersGroup = markersGroupRef.current;

    if (markersGroup) {
      markersGroup.clearLayers();
    }

    const bounds = L.latLngBounds([]);

    outlets.forEach((outlet) => {
      const { lat, lng } = outlet.coordinates;
      bounds.extend([lat, lng]);

      const isSelected = selectedOutlet?.id === outlet.id;
      const statusColor = outlet.isUnderperforming
        ? '#ef4444' // red
        : outlet.healthScore >= 85
        ? '#10b981' // green
        : '#f59e0b'; // amber

      // Custom SVG Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-outlet-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '38px' : '32px'};
            height: ${isSelected ? '38px' : '32px'};
            background-color: ${statusColor};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            cursor: pointer;
            transition: all 0.2s ease;
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
          ">
            <span style="color: white; font-weight: 800; font-size: 11px; font-family: sans-serif;">
              ${outlet.healthScore}
            </span>
            ${outlet.isUnderperforming ? `
              <div style="
                position: absolute;
                top: -4px;
                right: -4px;
                width: 12px;
                height: 12px;
                background-color: #dc2626;
                border: 2px solid white;
                border-radius: 50%;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 200px;">
          <div style="display: flex; items-center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-weight: 800; font-size: 14px; color: #0f172a;">${outlet.name}</span>
            <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background-color: ${
              outlet.isUnderperforming ? '#fee2e2' : '#d1fae5'
            }; color: ${outlet.isUnderperforming ? '#991b1b' : '#065f46'}">
              Grade ${outlet.healthGrade}
            </span>
          </div>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;">${outlet.address}, ${outlet.city}</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background-color: #f8fafc; padding: 6px; border-radius: 6px; margin-bottom: 8px;">
            <div>
              <div style="font-size: 9px; color: #64748b; text-transform: uppercase;">Monthly Revenue</div>
              <div style="font-weight: 700; font-size: 12px; color: #0f172a;">$${outlet.monthlyRevenue.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 9px; color: #64748b; text-transform: uppercase;">Health Score</div>
              <div style="font-weight: 700; font-size: 12px; color: ${statusColor};">${outlet.healthScore}/100</div>
            </div>
          </div>

          <div style="font-size: 11px; color: #334155; margin-bottom: 8px;">
            <strong>Manager:</strong> ${outlet.manager}<br/>
            <strong>Fulfillment Speed:</strong> ${outlet.fulfillmentTimeMin} mins avg
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectOutlet(outlet);
      });

      if (markersGroup) {
        marker.addTo(markersGroup);
      }
    });

    if (outlets.length > 0 && bounds.isValid() && !selectedOutlet) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    } else if (selectedOutlet) {
      map.setView([selectedOutlet.coordinates.lat, selectedOutlet.coordinates.lng], 11, {
        animate: true,
      });
    }

  }, [outlets, selectedOutlet, onSelectOutlet]);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100">
      <div ref={mapRef} className="w-full h-full z-10" />

      {/* Map Floating Overlay Legend */}
      <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 text-xs">
        <p className="font-bold text-slate-800 text-[11px] mb-1.5 uppercase tracking-wider">Outlet Map Pin Status</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
            <span>Optimal (&gt;85 Health Score)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200"></span>
            <span>Average (70-84 Health)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200"></span>
            <span>Underperforming (&lt;70 Health)</span>
          </div>
        </div>
      </div>

      {/* Selected Location Banner */}
      {selectedOutlet && (
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
              {selectedOutlet.code}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">{selectedOutlet.name}</p>
              <p className="text-[11px] text-slate-500">{selectedOutlet.address}, {selectedOutlet.city}, {selectedOutlet.state}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedOutlet.name} ${selectedOutlet.address} ${selectedOutlet.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
