import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTraccarStore } from '../store/useTraccarStore';
import { cn } from '../lib/utils';
import { Battery, Zap, Clock, Navigation } from 'lucide-react';
import { format } from 'date-fns';

// Custom icons based on course/direction
const createCarIcon = (course: number, status: string) => {
  const color = status === 'online' ? '#00D4FF' : status === 'offline' ? '#94A3B8' : '#F97316';
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" style="transform: rotate(${course}deg)">
      <path d="M12 2L4 20l8-4 8 4-8-18z" stroke="white" stroke-width="1" stroke-linejoin="round"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svg,
    className: 'custom-car-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

function MapUpdater({ selectedDeviceId, positions }: { selectedDeviceId: number | null, positions: any }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedDeviceId && positions[selectedDeviceId]) {
      const pos = positions[selectedDeviceId];
      map.flyTo([pos.latitude, pos.longitude], 16, { animate: true, duration: 1 });
    }
  }, [selectedDeviceId, positions, map]);

  return null;
}

export default function MapView() {
  const { devices, positions, selectedDeviceId, selectDevice } = useTraccarStore();
  
  const devicesList = Object.values(devices);
  
  // Default center (Brazil approx)
  const defaultCenter: [number, number] = [-14.235, -51.925];
  
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={4}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {devicesList.map((device) => {
          const position = positions[device.id];
          if (!position || typeof position.latitude !== 'number' || typeof position.longitude !== 'number') return null;

          const isSelected = selectedDeviceId === device.id;
          // Status logic: prioritise device status or speed/outdated telemetry
          const isOffline = device.status === 'offline' || position.outdated;
          const isMoving = position.speed > 0.5;
          const status = device.status || (isOffline ? 'offline' : isMoving ? 'online' : 'stopped');

          return (
            <Marker
              key={device.id}
              position={[position.latitude, position.longitude]}
              icon={createCarIcon(position.course || 0, status)}
              eventHandlers={{
                click: () => selectDevice(device.id),
              }}
              zIndexOffset={isSelected ? 1000 : 0}
            >
              <Popup className="custom-popup" closeButton={false}>
                <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4 shadow-2xl text-slate-200 min-w-[250px]">
                  <div className="font-bold text-white text-lg mb-2 flex items-center justify-between">
                    <span>{device.name}</span>
                    <div className={cn(
                      "h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                      status === 'online' ? "bg-[#00D4FF] shadow-[#00D4FF]/50" : 
                      status === 'offline' ? "bg-slate-400" : "bg-orange-500 shadow-orange-500/50"
                    )} />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-400">
                      <Navigation className="h-4 w-4 mr-2 text-[#00D4FF]" />
                      <span className="text-white font-medium">{(position.speed * 1.852).toFixed(1)} km/h</span>
                    </div>
                    
                    <div className="flex items-center text-slate-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{format(new Date(position.fixTime), 'dd/MM HH:mm:ss')}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div className="flex items-center text-slate-400">
                        <Battery className="h-4 w-4 mr-1" />
                        <span>{position.attributes?.batteryLevel || 0}%</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <Zap className={cn("h-4 w-4 mr-1", position.attributes?.ignition ? "text-[#00D4FF]" : "text-slate-500")} />
                        <span>{position.attributes?.ignition ? 'Ligado' : 'Desligado'}</span>
                      </div>
                    </div>

                    {position.address && (
                      <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 line-clamp-2">
                        {position.address}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                     <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded-lg text-xs font-medium transition-colors">
                       Detalhes
                     </button>
                     <button className="flex-1 bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 py-1.5 rounded-lg text-xs font-medium transition-colors border border-[#00D4FF]/20">
                       Bloquear
                     </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <MapUpdater selectedDeviceId={selectedDeviceId} positions={positions} />
      </MapContainer>
      
      {/* Map dark mode styling via CSS filter */}
      <style>{`
        .map-tiles {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
        .leaflet-container {
          background: #0F172A;
          font-family: inherit;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          padding: 0;
        }
        .custom-popup .leaflet-popup-tip-container {
          display: none;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
