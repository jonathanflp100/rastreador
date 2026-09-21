import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTraccarStore } from '../store/useTraccarStore';
import { 
  Building2, Users, DollarSign, Activity, Plus, Search, 
  CheckCircle2, AlertCircle, ShieldAlert, LogOut, ArrowRight,
  Phone, Mail, Calendar, Eye, PauseCircle, PlayCircle, X,
  MapPin, Car, SlidersHorizontal, RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { Reseller } from '../types/traccar';

export default function AdminResellers() {
  const { user, resellers, addReseller, toggleResellerStatus, logout, loginAsRole, setSessionExpired } = useTraccarStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Em dia' | 'Atrasado' | 'Suspensa'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // New Reseller form state
  const [formData, setFormData] = useState({
    companyName: '',
    managerName: '',
    email: '',
    phone: '',
    plan: 'Pro (White-Label)' as Reseller['plan'],
    activeVehicles: 25,
    monthlyFee: 499.00
  });

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Filtered resellers
  const filteredResellers = useMemo(() => {
    return resellers.filter(r => {
      const matchesSearch = 
        r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        statusFilter === 'all' ||
        (statusFilter === 'Suspensa' ? r.accountStatus === 'Suspensa' : r.paymentStatus === statusFilter && r.accountStatus !== 'Suspensa');

      return matchesSearch && matchesFilter;
    });
  }, [resellers, searchTerm, statusFilter]);

  // Overall platform metrics
  const metrics = useMemo(() => {
    const total = resellers.length;
    const active = resellers.filter(r => r.accountStatus === 'Ativa').length;
    const totalVehicles = resellers.reduce((sum, r) => sum + r.activeVehicles, 0);
    const mrr = resellers.reduce((sum, r) => sum + r.monthlyFee, 0);
    const latePayments = resellers.filter(r => r.paymentStatus === 'Atrasado').length;

    return { total, active, totalVehicles, mrr, latePayments };
  }, [resellers]);

  const handleCreateReseller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email) return;

    addReseller({
      companyName: formData.companyName,
      managerName: formData.managerName || 'Responsável',
      email: formData.email,
      phone: formData.phone || '(11) 90000-0000',
      plan: formData.plan,
      activeVehicles: Number(formData.activeVehicles) || 10,
      paymentStatus: 'Em dia',
      accountStatus: 'Ativa',
      monthlyFee: formData.plan === 'Enterprise' ? 1499.00 : formData.plan === 'Pro (White-Label)' ? 499.00 : 199.00
    });

    setIsModalOpen(false);
    showToast(`Revendedora "${formData.companyName}" cadastrada com sucesso!`);
    setFormData({
      companyName: '',
      managerName: '',
      email: '',
      phone: '',
      plan: 'Pro (White-Label)',
      activeVehicles: 25,
      monthlyFee: 499.00
    });
  };

  const handleToggleStatus = (reseller: Reseller) => {
    toggleResellerStatus(reseller.id);
    const nextStatus = reseller.accountStatus === 'Ativa' ? 'Suspensa' : 'Reativada';
    showToast(`Conta de "${reseller.companyName}" foi ${nextStatus}.`);
  };

  const handleSwitchToManager = () => {
    loginAsRole('manager');
    navigate('/app');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col selection:bg-[#00D4FF]/30 selection:text-white">
      
      {/* Top Admin Header */}
      <header className="h-16 bg-[#1E293B] border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#00D4FF]">
            <div className="relative flex items-center justify-center">
              <MapPin className="h-7 w-7" />
              <Car className="h-3.5 w-3.5 absolute -mt-1" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Rotta</span>
            <span className="ml-2 bg-[#00D4FF]/15 text-[#00D4FF] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#00D4FF]/30">
              Super Admin
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-700 pl-6">
            <span>Servidor Traccar Cluster:</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              99.98% Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSwitchToManager}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
            title="Acessar o painel operacional de frota"
          >
            <Eye className="h-4 w-4 text-[#00D4FF]" />
            Visão do Gestor (Frota)
          </button>

          <button
            onClick={() => setSessionExpired(true)}
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors px-2 py-1.5 rounded"
            title="Simular expiração de sessão"
          >
            Testar Sessão Expirada
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
            title="Sair do sistema"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Toast feedback */}
        {actionSuccessMsg && (
          <div className="bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{actionSuccessMsg}</span>
          </div>
        )}

        {/* Header Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Gestão de Revendedoras</h1>
            <p className="text-slate-400 text-sm mt-1">
              Controle central de empresas parceiras, licenças de frotas e faturamento recorrente.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Nova Revendedora
          </button>
        </div>

        {/* 4 Cards de Métricas Gerais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revendedoras</span>
              <div className="h-9 w-9 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{metrics.total}</div>
            <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <span>{metrics.active} ativas na plataforma</span>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Veículos Ativos</span>
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Car className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{metrics.totalVehicles.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-slate-400 mt-2">
              Média de {Math.round(metrics.totalVehicles / (metrics.total || 1))} veíc / revenda
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">MRR Estimado</span>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">
              {metrics.mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Receita mensal de licenças
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inadimplência</span>
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center",
                metrics.latePayments > 0 ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
              )}>
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{metrics.latePayments}</div>
            <div className="text-xs text-slate-400 mt-2">
              {metrics.latePayments === 0 ? '100% dos pagamentos em dia' : 'Revendedoras com fatura pendente'}
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por empresa, gestor ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4FF]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1">Filtrar:</span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'Em dia', label: 'Pagamento em dia' },
              { id: 'Atrasado', label: 'Pagamento pendente' },
              { id: 'Suspensa', label: 'Contas Suspensas' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border",
                  statusFilter === tab.id
                    ? "bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/40"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resellers Table */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/70 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Empresa / Revenda</th>
                  <th className="py-3.5 px-4">Responsável</th>
                  <th className="py-3.5 px-4 text-center">Veículos Ativos</th>
                  <th className="py-3.5 px-4">Plano</th>
                  <th className="py-3.5 px-4 text-right">Mensalidade</th>
                  <th className="py-3.5 px-4 text-center">Status Pagamento</th>
                  <th className="py-3.5 px-4 text-center">Status Conta</th>
                  <th className="py-3.5 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredResellers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      Nenhuma revendedora encontrada com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  filteredResellers.map(reseller => (
                    <tr 
                      key={reseller.id} 
                      className={cn(
                        "hover:bg-slate-800/40 transition-colors",
                        reseller.accountStatus === 'Suspensa' && "opacity-75 bg-red-950/10"
                      )}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shrink-0">
                            {reseller.companyName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{reseller.companyName}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              Desde {reseller.createdAt}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-200">{reseller.managerName}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3 text-slate-500" />
                          {reseller.email}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
                          {reseller.activeVehicles} veíc
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-xs font-medium text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                          {reseller.plan}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-mono font-medium text-white">
                        {reseller.monthlyFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {reseller.paymentStatus === 'Em dia' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Em dia
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Atrasado
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {reseller.accountStatus === 'Ativa' ? (
                          <span className="text-xs font-semibold text-emerald-400">Ativa</span>
                        ) : (
                          <span className="text-xs font-semibold text-red-400">Suspensa</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(reseller)}
                            className={cn(
                              "text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1",
                              reseller.accountStatus === 'Ativa'
                                ? "text-red-400 hover:bg-red-500/10 border border-red-500/20"
                                : "text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20"
                            )}
                            title={reseller.accountStatus === 'Ativa' ? 'Suspender acesso da revenda' : 'Reativar acesso'}
                          >
                            {reseller.accountStatus === 'Ativa' ? (
                              <>
                                <PauseCircle className="h-3.5 w-3.5" />
                                Suspender
                              </>
                            ) : (
                              <>
                                <PlayCircle className="h-3.5 w-3.5" />
                                Reativar
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* White-Label Architecture Info Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#00D4FF]" />
              Multi-tenancy e Isolamento de Revendedoras (Traccar API)
            </h4>
            <p className="text-xs text-slate-400 max-w-2xl">
              Cada revendedora opera em um tenant isolado, com permissões para gerenciar seus próprios clientes finais, regras de alertas e frotas sem visibilidade cruzada entre parceiros.
            </p>
          </div>
          <button
            onClick={handleSwitchToManager}
            className="flex items-center gap-2 text-xs font-bold text-[#00D4FF] hover:underline"
          >
            Acessar Painel como Revendedora
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </main>

      {/* Modal: Nova Revendedora */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-[#00D4FF]/15 text-[#00D4FF] flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Cadastrar Nova Revendedora</h3>
                <p className="text-xs text-slate-400">Crie o acesso para o dono da nova plataforma white-label.</p>
              </div>
            </div>

            <form onSubmit={handleCreateReseller} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nome da Empresa / Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alfa Rastreamento Veicular"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Nome do Gestor *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roberto Almeida"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    placeholder="(11) 98765-4321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">E-mail de Login do Gestor *</label>
                <input
                  type="email"
                  required
                  placeholder="gestor@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Plano Contratado</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]"
                  >
                    <option value="Start">Start (R$ 199/mês)</option>
                    <option value="Pro (White-Label)">Pro White-Label (R$ 499/mês)</option>
                    <option value="Enterprise">Enterprise (R$ 1.499/mês)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Veículos Iniciais</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.activeVehicles}
                    onChange={(e) => setFormData({ ...formData, activeVehicles: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-slate-900 font-bold px-5 py-2 rounded-lg text-sm transition-colors"
                >
                  Criar Revendedora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
