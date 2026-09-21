import { useState } from 'react';
import { Save, Building2, Mail, Lock, Upload, KeyRound, CheckCircle2, Palette, Image as ImageIcon, Sparkles, AlertCircle, Globe, ExternalLink, HelpCircle } from 'lucide-react';
import { useTraccarStore } from '../store/useTraccarStore';
import { cn } from '../lib/utils';

const COLOR_PRESETS = [
  { name: 'Ciano Rotta', hex: '#00D4FF' },
  { name: 'Verde Esmeralda', hex: '#10B981' },
  { name: 'Âmbar Solar', hex: '#F59E0B' },
  { name: 'Roxo Tech', hex: '#8B5CF6' },
  { name: 'Rosa Vibrante', hex: '#F43F5E' },
  { name: 'Azul Real', hex: '#3B82F6' },
];

export default function Settings() {
  const { user, whiteLabel, setWhiteLabel, setSessionExpired } = useTraccarStore();
  
  // Tabs: 'branding' (only for manager/admin), 'profile', 'security'
  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin';
  const [activeTab, setActiveTab] = useState<'branding' | 'profile' | 'security'>(
    isManagerOrAdmin ? 'branding' : 'profile'
  );
  
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [domainSuccessMsg, setDomainSuccessMsg] = useState<string | null>(null);

  // White-label form state
  const [companyName, setCompanyName] = useState(whiteLabel.companyName || 'AutoTrack GPS');
  const [themeColor, setThemeColor] = useState(whiteLabel.primaryColor || '#00D4FF');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(whiteLabel.logoUrl);
  const [customDomain, setCustomDomain] = useState(whiteLabel.customDomain || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    setWhiteLabel({
      companyName,
      primaryColor: themeColor,
      logoUrl
    });
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 4000);
  };

  const handleSaveCustomDomain = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implementar detecção de domínio via window.location.hostname e busca de configuração de branding correspondente no backend
    setWhiteLabel({
      customDomain: customDomain.trim(),
      domainStatus: customDomain.trim() ? 'pending' : 'unconfigured'
    });
    setDomainSuccessMsg('Configuração salva! A propagação pode levar até 24h.');
    setTimeout(() => setDomainSuccessMsg(null), 6000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#0F172A] p-6 md:p-8 gap-6 overflow-y-auto custom-scrollbar">
      
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Configurações da Conta</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {isManagerOrAdmin 
                ? 'Personalize a marca da sua revendedora, dados corporativos e segurança'
                : 'Gerencie seus dados de acesso e segurança'}
            </p>
          </div>

          <button
            onClick={() => setSessionExpired(true)}
            className="text-xs text-slate-500 hover:text-amber-400 transition-colors border border-slate-700 bg-slate-800/60 px-3 py-1.5 rounded-lg"
            title="Simular resposta 401 de sessão expirada"
          >
            Simular Sessão Expirada
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-5xl">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          
          {/* Aba White-label exclusiva para Revendedoras/Managers */}
          {isManagerOrAdmin && (
            <button
              onClick={() => setActiveTab('branding')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left border",
                activeTab === 'branding'
                  ? "bg-brand/10 text-brand border-brand/30 shadow-brand font-bold"
                  : "text-slate-400 hover:bg-[#1E293B] hover:text-white border-transparent"
              )}
            >
              <Palette className="h-5 w-5 shrink-0" />
              <div>
                <div>Marca da Empresa</div>
                <div className="text-[11px] text-slate-500 font-normal">White-Label & Cores</div>
              </div>
            </button>
          )}

          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left border",
              activeTab === 'profile'
                ? "bg-brand/10 text-brand border-brand/30 font-bold"
                : "text-slate-400 hover:bg-[#1E293B] hover:text-white border-transparent"
            )}
          >
            <Building2 className="h-5 w-5 shrink-0" />
            Perfil & Dados
          </button>
          
          <button
            onClick={() => setActiveTab('security')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left border",
              activeTab === 'security'
                ? "bg-brand/10 text-brand border-brand/30 font-bold"
                : "text-slate-400 hover:bg-[#1E293B] hover:text-white border-transparent"
            )}
          >
            <KeyRound className="h-5 w-5 shrink-0" />
            Segurança & Senha
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#1E293B] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          
          {showSavedMsg && (
            <div className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Configurações aplicadas com sucesso!</p>
                <p className="text-xs text-emerald-500">A interface e o header foram atualizados com a sua nova identidade visual.</p>
              </div>
            </div>
          )}

          {/* TAB 1: MARCA DA EMPRESA (WHITE-LABEL) - VISÍVEL APENAS PARA MANAGER/ADMIN */}
          {activeTab === 'branding' && isManagerOrAdmin && (
            <div className="space-y-8">
              <form onSubmit={handleSaveBranding} className="space-y-8">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-brand mb-1">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-xs uppercase font-bold tracking-wider">Personalização White-Label</span>
                </div>
                <h3 className="text-xl font-bold text-white">Marca da Sua Plataforma</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Substitua a identidade visual do sistema. As cores e o logotipo escolhidos serão vistos por todos os seus clientes finais.
                </p>
              </div>

              {/* Upload de Logotipo */}
              <div className="space-y-3">
                <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block">
                  Logotipo da Empresa
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="h-20 w-32 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden p-2">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="text-center text-slate-500">
                        <ImageIcon className="h-8 w-8 mx-auto opacity-50 mb-1" />
                        <span className="text-[10px] block">Sem logo</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-700 text-sm font-semibold cursor-pointer">
                        <Upload className="h-4 w-4" />
                        Enviar Novo Logo
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                      </label>

                      {logoUrl && (
                        <button 
                          type="button" 
                          onClick={() => setLogoUrl(undefined)}
                          className="text-xs text-red-400 hover:text-red-300 px-3 py-2 font-semibold"
                        >
                          Restaurar Padrão
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">Formatos aceitos: PNG, SVG ou JPG com fundo transparente (máx. 2MB).</p>
                  </div>
                </div>
              </div>

              {/* Nome da Marca */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block">
                  Nome da Marca no Header
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex: AutoTrack Rastreamento"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
                />
                <p className="text-xs text-slate-500">Esse nome aparecerá no menu lateral e nos relatórios gerados.</p>
              </div>

              {/* Cor Primária da Interface */}
              <div className="space-y-4">
                <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block">
                  Cor Primária de Destaque
                </label>

                {/* Presets rápidos */}
                <div className="flex flex-wrap gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setThemeColor(preset.hex)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                        themeColor.toUpperCase() === preset.hex.toUpperCase()
                          ? "border-white bg-slate-800 text-white shadow-md scale-105"
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800"
                      )}
                    >
                      <span 
                        className="h-3.5 w-3.5 rounded-full border border-black/30 shrink-0" 
                        style={{ backgroundColor: preset.hex }} 
                      />
                      {preset.name}
                    </button>
                  ))}
                </div>

                {/* Seletor Customizado */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2">
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="h-9 w-12 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="font-mono text-xs font-bold text-slate-200 px-2 uppercase">
                      {themeColor}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Ajuste fino com qualquer código HEX
                  </span>
                </div>
              </div>

              {/* Pré-visualização ao vivo */}
              <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Pré-visualização do Tema
                </span>
                
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    type="button"
                    className="text-slate-900 px-5 py-2 rounded-lg text-sm font-bold shadow-lg transition-transform active:scale-95"
                    style={{ backgroundColor: themeColor }}
                  >
                    Botão Primário
                  </button>

                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold border"
                    style={{ 
                      color: themeColor, 
                      borderColor: `${themeColor}40`,
                      backgroundColor: `${themeColor}15`
                    }}
                  >
                    Badge Ativo
                  </span>

                  <div className="flex items-center gap-2 text-sm font-bold" style={{ color: themeColor }}>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Texto de Destaque</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 text-slate-900 px-7 py-3 rounded-xl font-bold transition-all shadow-lg hover:opacity-95"
                  style={{ backgroundColor: themeColor }}
                >
                  <Save className="h-4 w-4" />
                  Salvar e Aplicar Marca
                </button>
              </div>
            </form>

            {/* BLOCO: DOMÍNIO PERSONALIZADO (APENAS MANAGER/ADMIN) */}
            <div className="mt-10 pt-8 border-t border-slate-800 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-brand mb-1">
                    <Globe className="h-5 w-5" />
                    <span className="text-xs uppercase font-bold tracking-wider">Acesso Exclusivo</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Domínio Personalizado</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Vincule seu domínio próprio para que seus clientes acessem a plataforma pelo seu endereço institucional.
                  </p>
                </div>

                {whiteLabel.customDomain && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Propagação DNS pendente
                  </span>
                )}
              </div>

              {domainSuccessMsg && (
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl animate-in fade-in">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-semibold">{domainSuccessMsg}</p>
                </div>
              )}

              <form onSubmit={handleSaveCustomDomain} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block" htmlFor="customDomainInput">
                    Seu Domínio Registrado
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      id="customDomainInput"
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="app.suaempresa.com.br"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand font-mono placeholder:font-sans placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Instruções de Apontamento DNS */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                    <HelpCircle className="h-4 w-4 text-brand" />
                    Como configurar no seu provedor de domínio (ex: Registro.br, Cloudflare, GoDaddy):
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Configure um registro <strong className="text-white">CNAME</strong> no seu provedor de domínio apontando para: <code className="text-brand bg-brand/10 px-2 py-0.5 rounded font-mono text-xs border border-brand/20">app.rotta.com</code>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-400">
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block">Tipo de Registro:</span>
                      <span className="text-white font-mono font-bold">CNAME</span>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block">Nome / Host:</span>
                      <span className="text-white font-mono font-bold">{customDomain.split('.')[0] || 'app'}</span>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block">Destino / Valor:</span>
                      <span className="text-brand font-mono font-bold">app.rotta.com</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors border border-slate-700 text-sm shadow-md"
                  >
                    <Save className="h-4 w-4" />
                    Salvar Domínio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

          {/* TAB 2: PERFIL & DADOS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 mb-6">
                Dados Cadastrais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                    Nome Completo / Razão Social
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="text" 
                      defaultValue={user?.name || 'AutoTrack GPS'}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                    E-mail de Acesso
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="email" 
                      defaultValue={user?.email || 'admin@rotta.app'}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button type="submit" className="flex items-center gap-2 bg-brand text-slate-900 px-6 py-2.5 rounded-lg font-bold hover:bg-brand/90 transition-colors">
                  <Save className="h-4 w-4" />
                  Salvar Perfil
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SEGURANÇA */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 mb-6">
                Alteração de Senha
              </h3>
              
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Senha Atual</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Confirmar Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-start">
                <button type="submit" className="flex items-center gap-2 bg-brand text-slate-900 px-6 py-2.5 rounded-lg font-bold hover:bg-brand/90 transition-colors">
                  Atualizar Senha
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
