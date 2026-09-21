import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useTraccarStore } from './store/useTraccarStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Reports from './pages/Reports';
import Geofences from './pages/Geofences';
import Commands from './pages/Commands';
import Vehicles from './pages/Vehicles';
import Settings from './pages/Settings';
import AdminResellers from './pages/AdminResellers';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import { Loader2, AlertCircle } from 'lucide-react';
import type { UserRole } from './types/traccar';

function SessionExpiredModal() {
  const { isSessionExpired, setSessionExpired, logout } = useTraccarStore();
  const navigate = useNavigate();

  if (!isSessionExpired) return null;

  const handleSessionExpired = () => {
    setSessionExpired(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-[#1E293B] p-6 text-center shadow-2xl border border-slate-700">
        <div className="h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">Sua sessão expirou</h3>
        <p className="mb-6 text-xs text-slate-400 leading-relaxed">
          O token de autenticação Traccar expirou ou retornou erro 401. Faça login novamente para restabelecer a conexão segura.
        </p>
        <button
          onClick={handleSessionExpired}
          className="w-full rounded-xl bg-[#00D4FF] px-4 py-2.5 font-bold text-slate-900 transition-all hover:bg-[#00D4FF]/90 shadow-[0_0_15px_rgba(0,212,255,0.2)]"
        >
          Ir para o Login
        </button>
      </div>
    </div>
  );
}

function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: UserRole;
}) {
  const { isAuthenticated, isLoading, user } = useTraccarStore();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0F172A] text-[#00D4FF]">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user does not have permission (e.g. non-admin trying to access /admin)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { checkAuth } = useTraccarStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <SessionExpiredModal />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Super Admin Module (Rotta) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminResellers />
            </ProtectedRoute>
          }
        />

        {/* Operational Dashboard & Fleet Management */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="history" element={<History />} />
          <Route path="reports" element={<Reports />} />
          <Route path="geofences" element={<Geofences />} />
          <Route path="commands" element={<Commands />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback alias for /settings */}
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
