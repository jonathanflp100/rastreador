import { useState } from 'react';
import { Car, Zap, Unlock, MapPin, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useTraccarStore } from '../store/useTraccarStore';

// Mock history
const mockCommandHistory = [
  { id: 1, deviceId: 1, command: 'Bloquear motor', status: 'confirmado', time: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 2, deviceId: 1, command: 'Desbloquear motor', status: 'confirmado', time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 3, deviceId: 2, command: 'Solicitar posição atual', status: 'enviado', time: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 4, deviceId: 3, command: 'Bloquear motor', status: 'falhou', time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

export default function Commands() {
  const { devices } = useTraccarStore();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingCommand, setPendingCommand] = useState<{ label: string; action: string } | null>(null);
  
  const [history, setHistory] = useState(mockCommandHistory);

  const availableCommands = [
    { label: 'Bloquear motor', action: 'engineStop', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Desbloquear motor', action: 'engineResume', icon: Unlock, color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10' },
    { label: 'Solicitar posição atual', action: 'positionSingle', icon: MapPin, color: 'text-slate-200', bg: 'bg-slate-700/50' },
  ];

  const handleCommandClick = (cmd: { label: string; action: string }) => {
    if (!selectedVehicle) return;
    setPendingCommand(cmd);
    setShowConfirmModal(true);
  };

  const confirmCommand = () => {
    if (pendingCommand && selectedVehicle) {
      // Create new history entry
      const newEntry = {
        id: Date.now(),
        deviceId: Number(selectedVehicle),
        command: pendingCommand.label,
        status: 'enviado',
        time: new Date().toISOString()
      };
      setHistory([newEntry, ...history]);
      
      // Simulating a success response after 2s
      setTimeout(() => {
        setHistory(prev => prev.map(item => item.id === newEntry.id ? { ...item, status: 'confirmado' } : item));
      }, 2000);
    }
    setShowConfirmModal(false);
    setPendingCommand(null);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#0F172A] p-6 gap-6 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Comandos</h1>
        <p className="text-slate-400 mt-1">Envie comandos remotos para seus veículos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column - Actions */}
        <div className="flex flex-col gap-6">
          {/* Selector Card */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5">
            <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider block mb-2">Veículo Alvo</label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <select 
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white appearance-none focus:border-[#00D4FF] focus:outline-none focus:ring-1 focus:ring-[#00D4FF] transition-colors"
              >
                <option value="">Selecione um veículo...</option>
                {Object.values(devices).map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Commands Card */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 flex-1">
             <h3 className="text-lg font-semibold text-white mb-4">Ações Disponíveis</h3>
             
             {!selectedVehicle ? (
               <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-xl">
                 <p className="text-slate-500 text-sm">Selecione um veículo primeiro</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-3">
                 {availableCommands.map((cmd) => (
                   <button
                     key={cmd.action}
                     onClick={() => handleCommandClick(cmd)}
                     className="flex items-center p-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-600 transition-all group"
                   >
                     <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${cmd.bg} ${cmd.color} mr-4`}>
                       <cmd.icon className="h-5 w-5" />
                     </div>
                     <div className="text-left flex-1">
                       <span className="block font-medium text-slate-200 group-hover:text-white transition-colors">{cmd.label}</span>
                     </div>
                   </button>
                 ))}
               </div>
             )}
          </div>
        </div>

        {/* Right Column - History */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-xl flex flex-col h-full min-h-[500px]">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Últimos Comandos</h3>
            <Clock className="h-5 w-5 text-slate-500" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {history.filter(h => selectedVehicle === '' || h.deviceId === Number(selectedVehicle)).length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-500 text-sm">Nenhum comando recente</p>
              </div>
            ) : (
              <div className="space-y-1">
                {history
                  .filter(h => selectedVehicle === '' || h.deviceId === Number(selectedVehicle))
                  .map((item) => (
                  <div key={item.id} className="p-4 rounded-lg hover:bg-slate-800/50 flex items-start gap-4 transition-colors">
                    <div className="mt-0.5">
                      {item.status === 'confirmado' ? <CheckCircle2 className="h-5 w-5 text-[#00D4FF]" /> : 
                       item.status === 'falhou' ? <XCircle className="h-5 w-5 text-red-500" /> :
                       <Clock className="h-5 w-5 text-orange-400 animate-pulse" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-slate-200">{item.command}</p>
                        <span className="text-xs text-slate-500">
                          {new Date(item.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Veículo: {devices[item.deviceId]?.name || 'Desconhecido'} • 
                        <span className="ml-1 capitalize">{item.status}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && pendingCommand && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl bg-[#1E293B] p-6 shadow-2xl border border-slate-700 transform transition-all">
            <h3 className="mb-4 text-xl font-bold text-white">Confirmar Ação</h3>
            <p className="mb-6 text-sm text-slate-300">
              Tem certeza que deseja enviar o comando <strong className="text-[#00D4FF]">{pendingCommand.label}</strong> para o veículo <strong>{devices[Number(selectedVehicle)]?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-lg border border-slate-600 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCommand}
                className="flex-1 rounded-lg bg-[#00D4FF] px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#00D4FF]/90 shadow-[0_0_15px_rgba(0,212,255,0.2)]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
