import { Map as MapIcon, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Mock Geofences
const mockGeofences = [
  { id: 1, name: 'Base Matriz', type: 'Polígono', active: true },
  { id: 2, name: 'Cliente Alpha (Risco)', type: 'Círculo', active: true },
  { id: 3, name: 'Garagem Sul', type: 'Círculo', active: false },
];

export default function Geofences() {
  const [fences, setFences] = useState(mockGeofences);

  const toggleFence = (id: number) => {
    setFences(fences.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  return (
    <div className="flex h-full w-full bg-[#0F172A] relative">
      
      {/* Sidebar - Geofence List */}
      <div className="w-80 bg-[#1E293B] border-r border-slate-800 flex flex-col z-10 shrink-0">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4">Cercas Virtuais</h2>
          <button className="w-full flex items-center justify-center gap-2 bg-[#00D4FF] text-slate-900 font-semibold px-4 py-2.5 rounded-lg hover:bg-[#00D4FF]/90 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Nova Cerca</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {fences.map(fence => (
            <div key={fence.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-slate-200">{fence.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{fence.type}</p>
                </div>
                <button 
                  onClick={() => toggleFence(fence.id)}
                  className="text-slate-400 hover:text-[#00D4FF] transition-colors"
                >
                  {fence.active ? (
                    <ToggleRight className="h-6 w-6 text-[#00D4FF]" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/50">
                <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400">Atribuída a 5 veículos</span>
                <button className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-slate-900 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png')] bg-repeat"></div>
        <div className="z-10 bg-[#1E293B]/90 backdrop-blur-md p-6 rounded-xl border border-slate-800 flex flex-col items-center text-center max-w-sm mx-4 shadow-2xl">
          <MapIcon className="h-12 w-12 text-[#00D4FF] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Editor de Cercas</h3>
          <p className="text-sm text-slate-400">
            Clique em "Nova Cerca" para desenhar uma área de restrição no mapa. Você pode configurar alertas de entrada e saída.
          </p>
        </div>
      </div>

    </div>
  );
}
