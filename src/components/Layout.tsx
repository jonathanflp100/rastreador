import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useTraccarStore } from '../store/useTraccarStore';
import { 
  MapPin, LayoutDashboard, History, FileText, Map, LogOut, Menu, X, 
  Bell, Car, Radio, CarFront, Settings as SettingsIcon, AlertCircle, 
  ShieldAlert, UserCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, whiteLabel, loginAsRole } = useTraccarStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav Items adaptados para o perfil do usuário (Admin, Manager ou Cliente Final)
  const isUserRole = user?.role === 'user';
  const isAdmin = user?.role === 'admin';

  const navItems = isUserRole
    ? [
        { to: '/app', icon: Car, label: 'Meu Veículo' },
        { to: '/app/history', icon: History, label: 'Histórico de Rotas' },
      ]
    : [
        { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/app/history', icon: History, label: 'Histórico' },
        { to: '/app/reports', icon: FileText, label: 'Relatórios' },
        { to: '/app/geofences', icon: Map, label: 'Cercas Virtuais' },
        { to: '/app/commands', icon: Radio, label: 'Comandos' },
        { to: '/app/vehicles', icon: CarFront, label: 'Veículos' },
      ];

  const brandDisplayName = user?.role === 'admin' ? 'Rotta' : (whiteLabel.companyName || 'Rotta');

  return (
    <div className="flex h-screen bg-[#0F172A] text-slate-200">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full transform border-r border-slate-800 bg-[#1E293B] transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
          isSidebarOpen && "translate-x-0"
        )}
      >
        {/* Brand Logo & Name */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link to="/app" className="flex items-center gap-2.5 overflow-hidden">
            {whiteLabel.logoUrl && !isAdmin ? (
              <img src={whiteLabel.logoUrl} alt={brandDisplayName} className="h-8 max-w-[130px] object-contain" />
            ) : (
              <div className="flex items-center gap-2 text-brand">
                <div className="relative flex items-center justify-center shrink-0">
                  <MapPin className="h-7 w-7" />
                  <Car className="h-3.5 w-3.5 absolute -mt-1" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white truncate">
                  {brandDisplayName}
                </span>
              </div>
            )}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Super Admin Quick Link */}
        {isAdmin && (
          <div className="px-4 pt-3 pb-1">
            <Link
              to="/admin"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span>Painel Super Admin</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">Rotta</span>
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 px-3 pb-1">
            {isUserRole ? 'Seu Rastreamento' : 'Gestão de Frotas'}
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand/10 text-brand font-bold border border-brand/30 shadow-brand"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )
              }
            >
              <item.icon className={cn("mr-3 h-5 w-5 flex-shrink-0")} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Footer Card */}
        <div className="border-t border-slate-800 p-4 shrink-0 bg-[#192231]">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 pr-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 font-bold text-white shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="ml-3 truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Usuário'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.2 rounded",
                    isAdmin ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                    isUserRole ? "bg-slate-700 text-slate-300" :
                    "bg-brand/20 text-brand border border-brand/30"
                  )}>
                    {isAdmin ? 'Super Admin' : isUserRole ? 'Cliente Final' : 'Revendedora'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Link
                to="/settings"
                onClick={() => setIsSidebarOpen(false)}
                className="text-slate-400 hover:text-brand transition-colors p-1.5 rounded-lg hover:bg-slate-800"
                title="Configurações"
              >
                <SettingsIcon className="h-4 w-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
                title="Sair da conta"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-[#1E293B]/80 px-4 backdrop-blur-sm md:px-6 z-10 relative">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-400 hover:text-white md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Quick Role Tester in Header (para teste rápido entre as 3 camadas) */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-500 text-[11px]">Alternar Perfil:</span>
            <button
              onClick={() => loginAsRole('admin')}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-colors border",
                isAdmin 
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold" 
                  : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
              )}
            >
              Super Admin
            </button>
            <button
              onClick={() => loginAsRole('manager')}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-colors border",
                user?.role === 'manager' 
                  ? "bg-brand/20 text-brand border-brand/40 font-bold" 
                  : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
              )}
            >
              Revendedora
            </button>
            <button
              onClick={() => loginAsRole('user')}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-colors border",
                isUserRole 
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/40 font-bold" 
                  : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
              )}
            >
              Cliente Final (1 Carro)
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Painel Super Admin
              </Link>
            )}

            <button 
              className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Notificações em tempo real"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
              </span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="relative flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
