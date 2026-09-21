import { Download, FileSpreadsheet } from 'lucide-react';
import { useTraccarStore } from '../store/useTraccarStore';

export default function Reports() {
  const { devices } = useTraccarStore();
  
  // Dummy data for visual
  const summaryData = Object.values(devices).slice(0, 5).map(d => ({
    id: d.id,
    name: d.name,
    distance: (Math.random() * 500).toFixed(1),
    maxSpeed: Math.floor(Math.random() * 60) + 60,
    avgSpeed: Math.floor(Math.random() * 40) + 30,
    engineHours: (Math.random() * 10).toFixed(1)
  }));

  return (
    <div className="flex h-full w-full flex-col bg-[#0F172A] p-6 gap-6 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-slate-400 mt-1">Gere resumos analíticos da frota</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-700">
          <Download className="h-4 w-4" />
          <span>Exportar CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Distância Total', val: '1,245 km', color: 'text-white' },
          { label: 'Tempo em Movimento', val: '45h 30m', color: 'text-white' },
          { label: 'Tempo Parado', val: '112h 15m', color: 'text-orange-400' },
          { label: 'Velocidade Média', val: '42 km/h', color: 'text-[#00D4FF]' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 shadow-sm">
            <p className="text-slate-400 text-sm font-medium mb-2">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1E293B] border border-slate-800 rounded-xl overflow-hidden flex-1 flex flex-col min-h-[300px]">
        <div className="p-4 border-b border-slate-800 bg-[#1E293B] flex items-center justify-between">
           <h3 className="text-white font-semibold flex items-center gap-2">
             <FileSpreadsheet className="h-4 w-4 text-[#00D4FF]" />
             Resumo por Veículo
           </h3>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 border-b border-slate-800">Veículo</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">Distância (km)</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">Vel. Máx (km/h)</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">Vel. Média (km/h)</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">Horas de Motor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {summaryData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Selecione um período para gerar o relatório
                  </td>
                </tr>
              ) : summaryData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{row.name}</td>
                  <td className="px-6 py-4 text-right">{row.distance}</td>
                  <td className="px-6 py-4 text-right text-[#00D4FF] font-medium">{row.maxSpeed}</td>
                  <td className="px-6 py-4 text-right">{row.avgSpeed}</td>
                  <td className="px-6 py-4 text-right">{row.engineHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
