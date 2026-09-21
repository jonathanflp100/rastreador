import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTraccarStore } from '../store/useTraccarStore';
import { MapPin, Loader2, AlertCircle, Car, ArrowLeft, ShieldAlert, Building2, User } from 'lucide-react';
import { cn } from '../lib/utils';
import type { UserRole } from '../types/traccar';

export default function Login() {
  const [email, setEmail] = useState('admin@rotta.app');
  const [password, setPassword] = useState('');
  const { login, loginAsRole, isLoading, error, clearError, user } = useTraccarStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const loggedUser = await login(email, password);
      if (loggedUser?.administrator || loggedUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/app');
      }
    } catch (err) {
      // O erro é tratado no store e renderizado no alerta do formulário
    }
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    loginAsRole(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/app');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] px-4 py-8 relative selection:bg-[#00D4FF]/30 selection:text-white">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar para a Landing Page
      </Link>
      
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#1E293B]/90 p-8 shadow-2xl backdrop-blur-xl border border-slate-800">
        
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00D4FF]/10 text-[#00D4FF] relative shadow-[0_0_20px_rgba(0,212,255,0.15)]">
            <MapPin className="h-8 w-8" />
            <Car className="h-4 w-4 absolute -mt-1" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Rotta</h2>
          <p className="mt-1 text-xs text-slate-400 text-center">Plataforma White-Label de Rastreamento Veicular</p>
        </div>

        {/* Server Connection Box */}
        <div className="mb-6 rounded-xl bg-slate-900/80 border border-slate-700/80 p-3.5 text-center">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#00D4FF] animate-pulse"></span>
            Conexão Traccar API
          </div>
          <div className="text-xs text-slate-300">
            Entre com as credenciais cadastradas no servidor Traccar
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 p-3.5 text-red-400 border border-red-500/20 text-xs">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#00D4FF] focus:outline-none transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#00D4FF] focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "flex w-full items-center justify-center rounded-xl bg-[#00D4FF] px-4 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-[#00D4FF]/90 shadow-[0_0_15px_rgba(0,212,255,0.2)]",
              isLoading && "cursor-not-allowed opacity-70"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>

        <div className="relative flex items-center my-5">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink-0 mx-3 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
            Ou teste direto por perfil
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* 3 Quick Role Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickRoleLogin('admin')}
            className="flex flex-col items-center justify-center gap-1.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/50 p-2.5 rounded-xl text-center transition-all group"
          >
            <ShieldAlert className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-slate-200">Super Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleLogin('manager')}
            className="flex flex-col items-center justify-center gap-1.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/70 hover:border-[#00D4FF]/50 p-2.5 rounded-xl text-center transition-all group"
          >
            <Building2 className="h-4 w-4 text-[#00D4FF] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-slate-200">Revendedora</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleLogin('user')}
            className="flex flex-col items-center justify-center gap-1.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-400/50 p-2.5 rounded-xl text-center transition-all group"
          >
            <Car className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-slate-200">Cliente (1 Carro)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
