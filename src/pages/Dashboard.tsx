import { useState, useMemo, useEffect } from 'react';
import { useTraccarStore } from '../store/useTraccarStore';
import MapView from '../components/Map';
import { 
  Search, AlertTriangle, Car, ShieldAlert, Key, Battery, 
  MapPin, Clock, Gauge, Lock, Unlock, CheckCircle2, X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { user, devices, positions, selectedDeviceId, selectDevice, fetchInitialData } = useTraccarStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'stopped' | 'offline'>('all');
  
  // Single vehicle user modal for engine cut-off
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [commandType, setCommandType] = useState<'engineStop' | 'engineResume'>('engineStop');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  const isUserRole = user?.role === 'user';

  // Carrega a lista real de dispositivos e posições da API do Traccar e atualiza periodicamente
  useEffect(() => {
    if (!user || user.isDemo) return;

    fetchInitialData();

    const interval = setInterval(() => {
      const state = useTraccarStore.getState();
      if (state.isAuthenticated && !state.isSessionExpired && !state.user?.isDemo) {
        fetchInitialData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchInitialData, user?.isDemo, user]);

  // For User Role: get their assigned single vehicle
  const userDevice = useMemo(() => {
    if (!isUserRole) return null;
    const assignedId = user?.assignedDeviceId || 1;
    const device = devices[assignedId] || Object.values(devices)[0];
    if (!device) return null;
    const position = positions[device.id];
    const isOffline = device.status === 'offline' || (!position || position.outdated);
    const isMoving = position && position.speed > 0.5;
    const status = isOffline ? 'offline' : isMoving ? 'online' : 'stopped';

    return {
      ...device,
      id: device.id,
      name: device.name,
      status: device.status || status,
      position
    };
  }, [isUserRole, user, devices, positions]);

  // For Manager/Admin: list of all fleet devices mapped with id, name, and status
  const devicesList = useMemo(() => {
    return Object.values(devices)
      .map(device => {
        const position = positions[device.id];
        const isOffline = device.status === 'offline' || (!position || position.outdated);
        const isMoving = position && position.speed > 0.5;
        const status = isOffline ? 'offline' : isMoving ? 'online' : 'stopped';
        
        return {
          ...device,
          id: device.id,
          name: device.name,
          status: device.status || status,
          position
        };
      })
      .filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [devices, positions, searchTerm, statusFilter]);

  const handleSendCommand = (type: 'engineStop' | 'engineResume') => {
    setCommandType(type);
    setShowCommandModal(true);
  };

  const confirmSendCommand = () => {
    setShowCommandModal(false);
    const actionText = commandType === 'engineStop' ? 'Bloqueio de motor' : 'Desbloqueio de motor';
    setCommandFeedback(`${actionText} enviado com sucesso para o veículo!`);
    setTimeout(() => setCommandFeedback(null), 4000);
  };

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      
      {/* Feedback Toast */}
      {commandFeedback && (
        <div className="absolute top-4 right-4 z-30 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{commandFeedback}</span>
        </div>
      )}

      {/* VIEW FOR END-USER (Dono do Carro / Cliente Final) */}
      {isUserRole && userDevice && (
        <div className="absolute top-4 left-4 z-10 w-96 max-w-[calc(100%-2rem)] flex flex-col gap-4 pointer-events-auto">
          <div className="bg-[#1E293B]/95 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-4">
            
            {/* Header com Nome e Status */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-snug">{userDevice.name}</h2>
                  <p className="text-xs text-slate-400">IMEI: {userDevice.uniqueId}</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border",
                  userDevice.status === 'online' 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                    : userDevice.status === 'stopped'
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                )}>
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    userDevice.status === 'online' ? "bg-emerald-400 animate-pulse" : userDevice.status === 'stopped' ? "bg-amber-400" : "bg-slate-400"
                  )} />
                  {userDevice.status === 'online' ? 'Em Movimento' : userDevice.status === 'stopped' ? 'Parado' : 'Sem Sinal'}
                </span>
              </div>
            </div>

            {/* Grid de Telemetria ao Vivo */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center text-brand mb-1">
                  <Gauge className="h-4 w-4" />
                </div>
                <div className="text-xs text-slate-400">Velocidade</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {userDevice.position?.speed ? `${(userDevice.position.speed * 1.852).toFixed(0)} km/h` : '0 km/h'}
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center mb-1 text-emerald-400">
                  <Key className="h-4 w-4" />
                </div>
                <div className="text-xs text-slate-400">Ignição</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {userDevice.position?.attributes?.ignition ? 'Ligada' : 'Desligada'}
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center mb-1 text-cyan-400">
                  <Battery className="h-4 w-4" />
                </div>
                <div className="text-xs text-slate-400">Bateria</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {userDevice.position?.attributes?.batteryLevel || 100}%
                </div>
              </div>
            </div>

            {/* Endereço Atual */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex items-start gap-2.5 text-xs">
              <MapPin className="h-4 w-4 text-brand shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-slate-400 text-[11px] font-medium">Localização em Tempo Real:</div>
                <div className="text-slate-200 font-medium leading-relaxed mt-0.5">
                  {userDevice.position?.address || 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP'}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1.5">
                  <Clock className="h-3 w-3" />
                  Última atualização: {userDevice.position?.fixTime 
                    ? formatDistanceToNow(new Date(userDevice.position.fixTime), { addSuffix: true, locale: ptBR })
                    : 'Agora mesmo'}
                </div>
              </div>
            </div>

            {/* Ações Rápidas de Segurança */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Comandos de Segurança
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSendCommand('engineStop')}
                  className="flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl py-2.5 px-3 text-xs font-bold transition-colors"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Bloquear Motor
                </button>

                <button
                  onClick={() => handleSendCommand('engineResume')}
                  className="flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl py-2.5 px-3 text-xs font-bold transition-colors"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  Desbloquear
                </button>
              </div>
            </div>

            {/* Histórico Recente do Carro */}
            <div className="border-t border-slate-800 pt-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Trajetos de Hoje</span>
                <span className="text-brand text-[10px] font-mono">3 paradas</span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
                  <div>
                    <div className="font-semibold text-slate-200">Em trânsito • Av. Paulista</div>
                    <div className="text-[10px] text-slate-500">14:32 • 25 km/h</div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Ativo</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
                  <div>
                    <div className="font-semibold text-slate-300">Estacionado • Shopping Pátio</div>
                    <div className="text-[10px] text-slate-500">12:15 às 14:10 (1h 55m)</div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Parado</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW FOR MANAGERS AND ADMINS (Fleet Overview) */}
      {!isUserRole && (
        <div className="absolute top-4 left-4 z-10 w-80 max-h-[calc(100%-2rem)] flex flex-col gap-4 pointer-events-none hidden md:flex">
          
          {/* Search & Filter Card */}
          <div className="bg-[#1E293B]/90 backdrop-blur-md rounded-xl border border-slate-800 p-4 shadow-2xl pointer-events-auto">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar veículo ou placa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
            
            <div className="flex gap-2">
              {(['all', 'online', 'stopped', 'offline'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-xs font-medium transition-colors border",
                    statusFilter === f 
                      ? "bg-brand/10 text-brand border-brand/30" 
                      : "bg-transparent text-slate-400 border-slate-700 hover:bg-slate-800"
                  )}
                >
                  {f === 'all' ? 'Todos' : f === 'online' ? 'Movendo' : f === 'stopped' ? 'Parado' : 'Offline'}
                </button>
              ))}
            </div>
          </div>

          {/* List Card */}
          <div className="bg-[#1E293B]/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl flex-1 overflow-hidden flex flex-col pointer-events-auto">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#1E293B]">
              <h3 className="font-semibold text-white">Veículos da Frota ({devicesList.length})</h3>
            </div>
            
            <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
              {devicesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                  <AlertTriangle className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Nenhum veículo encontrado</p>
                </div>
              ) : (
                devicesList.map(device => (
                  <button
                    key={device.id}
                    onClick={() => selectDevice(device.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all",
                      selectedDeviceId === device.id
                        ? "bg-brand/10 border-brand/30"
                        : "bg-slate-900/40 border-transparent hover:bg-slate-800 hover:border-slate-700"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-slate-200 text-sm truncate pr-2">{device.name}</span>
                      <div className={cn(
                        "h-2 w-2 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                        device.status === 'online' ? "bg-emerald-400 shadow-emerald-400/50" : 
                        device.status === 'offline' ? "bg-slate-400" : "bg-orange-500 shadow-orange-500/50"
                      )} />
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between">
                      <span>
                        {device.position?.speed 
                          ? `${(device.position.speed * 1.852).toFixed(1)} km/h` 
                          : '0 km/h'}
                      </span>
                      <span>
                        {device.position?.fixTime 
                          ? formatDistanceToNow(new Date(device.position.fixTime), { addSuffix: true, locale: ptBR })
                          : 'Sem dados'}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map Layer */}
      <MapView />

      {/* Modal de Confirmação de Comando para o Cliente Final */}
      {showCommandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowCommandModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                commandType === 'engineStop' ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
              )}>
                {commandType === 'engineStop' ? <ShieldAlert className="h-6 w-6" /> : <Unlock className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {commandType === 'engineStop' ? 'Confirmar Bloqueio do Motor' : 'Confirmar Desbloqueio do Motor'}
                </h3>
                <p className="text-xs text-slate-400">Comando de telemetria via satélite/GPRS</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {commandType === 'engineStop'
                ? 'Tem certeza de que deseja enviar o comando para cortar a ignição deste veículo? Por motivos de segurança, o bloqueio efetivo só ocorre em baixas velocidades.'
                : 'Deseja restabelecer o circuito de partida e liberar o funcionamento normal do motor?'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCommandModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmSendCommand}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all",
                  commandType === 'engineStop' 
                    ? "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30" 
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
                )}
              >
                {commandType === 'engineStop' ? 'Sim, Bloquear Motor' : 'Sim, Desbloquear'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
