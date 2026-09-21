import { useState } from 'react';
import { useTraccarStore } from '../store/useTraccarStore';
import { Play, Pause, FastForward, Calendar, Car } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart to show UI
const mockChartData = Array.from({ length: 50 }).map((_, i) => ({
  time: `${Math.floor(i/4)}:${(i%4)*15 || '00'}`,
  speed: Math.random() * (i > 10 && i < 40 ? 80 : 0) + (i > 10 && i < 40 ? 20 : 0)
}));

export default function History() {
  const { devices } = useTraccarStore();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex h-full w-full flex-col bg-[#0F172A] p-6 gap-6 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Histórico e Replay</h1>
          <p className="text-slate-400 mt-1">Reproduza trajetos e analise o histórico de deslocamento</p>
        </div>
      </div>

      {/* Controls Card */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-1">
          <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Veículo</label>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white appearance-none focus:border-[#00D4FF] focus:outline-none">
              <option value="">Selecione um veículo...</option>
              {Object.values(devices).map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex-1 space-y-1">
          <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Início</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input type="datetime-local" className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#00D4FF] focus:outline-none" />
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Fim</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input type="datetime-local" className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#00D4FF] focus:outline-none" />
          </div>
        </div>

        <div className="flex items-end pb-[2px]">
          <button className="bg-[#00D4FF] text-slate-900 font-semibold px-6 py-2.5 rounded-lg hover:bg-[#00D4FF]/90 transition-colors w-full md:w-auto">
            Buscar Trajeto
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col xl:flex-row gap-6 min-h-[500px]">
        {/* Map Placeholder */}
        <div className="flex-[2] bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
           <div className="absolute inset-0 opacity-20 bg-[url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png')] bg-repeat"></div>
           <p className="text-slate-500 z-10">Selecione os filtros acima para visualizar o mapa</p>
           
           {/* Floating Player Controls */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 p-3 rounded-full flex items-center gap-4 z-10 shadow-2xl">
             <button onClick={() => setIsPlaying(!isPlaying)} className="bg-[#00D4FF] text-slate-900 p-3 rounded-full hover:bg-[#00D4FF]/90 transition-transform hover:scale-105">
               {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
             </button>
             
             <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
               <div className="bg-[#00D4FF] h-full w-1/3"></div>
             </div>
             
             <button className="text-slate-400 hover:text-white p-2">
               <FastForward className="h-5 w-5" />
             </button>
           </div>
        </div>

        {/* Chart & Stats */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Velocidade ao longo do percurso (km/h)</h3>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#00D4FF' }}
                  />
                  <Area type="monotone" dataKey="speed" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorSpeed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
             <h3 className="text-sm font-semibold text-white">Resumo do Percurso</h3>
             
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                 <p className="text-xs text-slate-500">Distância Total</p>
                 <p className="text-xl font-semibold text-white mt-1">142<span className="text-sm text-slate-400 font-normal ml-1">km</span></p>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                 <p className="text-xs text-slate-500">Vel. Máxima</p>
                 <p className="text-xl font-semibold text-[#00D4FF] mt-1">105<span className="text-sm text-[#00D4FF]/70 font-normal ml-1">km/h</span></p>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                 <p className="text-xs text-slate-500">Tempo em Mov.</p>
                 <p className="text-xl font-semibold text-white mt-1">2<span className="text-sm text-slate-400 font-normal mx-1">h</span>15<span className="text-sm text-slate-400 font-normal ml-1">m</span></p>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                 <p className="text-xs text-slate-500">Consumo Est.</p>
                 <p className="text-xl font-semibold text-white mt-1">14.5<span className="text-sm text-slate-400 font-normal ml-1">L</span></p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
