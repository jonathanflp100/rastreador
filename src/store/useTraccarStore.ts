import { create } from 'zustand';
import type { User, Device, Position, UserRole, WhiteLabelConfig, Reseller } from '../types/traccar';
import { traccarService } from '../services/traccar';

// Helper to convert hex to rgb string for CSS custom properties
function hexToRgb(hex: string): string {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16) || 0;
  const g = parseInt(sanitized.substring(2, 4), 16) || 212;
  const b = parseInt(sanitized.substring(4, 6), 16) || 255;
  return `${r}, ${g}, ${b}`;
}

export function applyBrandColor(color: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--brand-primary', color);
    document.documentElement.style.setProperty('--color-primary', color);
    document.documentElement.style.setProperty('--brand-primary-rgb', hexToRgb(color));
  }
}

// Initial Mock Resellers for Super Admin
const INITIAL_RESELLERS: Reseller[] = [
  {
    id: 'res-1',
    companyName: 'AutoTrack GPS Brasil',
    managerName: 'Marcos Ribeiro',
    email: 'marcos@autotrackgps.com.br',
    phone: '(11) 98765-4321',
    plan: 'Pro (White-Label)',
    activeVehicles: 145,
    paymentStatus: 'Em dia',
    accountStatus: 'Ativa',
    createdAt: '15/01/2025',
    monthlyFee: 1064.50
  },
  {
    id: 'res-2',
    companyName: 'SegurCar Rastreamento',
    managerName: 'Carla Esteves',
    email: 'carla@segurcar.com',
    phone: '(21) 99887-1122',
    plan: 'Pro (White-Label)',
    activeVehicles: 82,
    paymentStatus: 'Em dia',
    accountStatus: 'Ativa',
    createdAt: '03/03/2025',
    monthlyFee: 818.80
  },
  {
    id: 'res-3',
    companyName: 'LocalizaFrota Express',
    managerName: 'Rodrigo Antunes',
    email: 'rodrigo@localizafrota.com.br',
    phone: '(31) 97123-9988',
    plan: 'Enterprise',
    activeVehicles: 310,
    paymentStatus: 'Em dia',
    accountStatus: 'Ativa',
    createdAt: '10/11/2024',
    monthlyFee: 2208.00
  },
  {
    id: 'res-4',
    companyName: 'Norte Rastreamento',
    managerName: 'Fernando Dias',
    email: 'contato@norterastreamento.com.br',
    phone: '(91) 98111-2233',
    plan: 'Start',
    activeVehicles: 28,
    paymentStatus: 'Atrasado',
    accountStatus: 'Ativa',
    createdAt: '22/04/2025',
    monthlyFee: 336.20
  },
  {
    id: 'res-5',
    companyName: 'RotaSegura Telemetria',
    managerName: 'Patrícia Lima',
    email: 'patricia@rotasegura.com.br',
    phone: '(41) 99654-7890',
    plan: 'Pro (White-Label)',
    activeVehicles: 94,
    paymentStatus: 'Em dia',
    accountStatus: 'Suspensa',
    createdAt: '05/08/2024',
    monthlyFee: 865.60
  }
];

interface TraccarState {
  user: User | null;
  devices: Record<number, Device>;
  positions: Record<number, Position>;
  selectedDeviceId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  socket: WebSocket | null;

  // Multi-tier White-Label and Super Admin
  whiteLabel: WhiteLabelConfig;
  resellers: Reseller[];
  setWhiteLabel: (config: Partial<WhiteLabelConfig>) => void;
  addReseller: (reseller: Omit<Reseller, 'id' | 'createdAt'>) => void;
  toggleResellerStatus: (id: string) => void;

  isSessionExpired: boolean;
  setSessionExpired: (status: boolean) => void;
  addDevice: (device: Omit<Device, 'id' | 'positionId' | 'groupId' | 'status' | 'disabled' | 'lastUpdate' | 'attributes'>) => void;
  removeDevice: (id: number) => void;

  login: (email: string, password: string) => Promise<User>;
  loginAsRole: (role: UserRole) => void;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchInitialData: () => Promise<void>;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  selectDevice: (id: number | null) => void;
  clearError: () => void;
}

const savedBrand = typeof localStorage !== 'undefined' ? localStorage.getItem('rotta_branding') : null;
const initialBrand: WhiteLabelConfig = savedBrand 
  ? JSON.parse(savedBrand) 
  : { companyName: 'Rotta', primaryColor: '#00D4FF' };

// Initialize CSS property
applyBrandColor(initialBrand.primaryColor);

export const useTraccarStore = create<TraccarState>((set, get) => ({
  user: null,
  devices: {},
  positions: {},
  selectedDeviceId: null,
  isAuthenticated: false,
  isSessionExpired: false,
  isLoading: true,
  error: null,
  socket: null,

  whiteLabel: initialBrand,
  resellers: INITIAL_RESELLERS,

  setWhiteLabel: (newConfig) => {
    const updated = { ...get().whiteLabel, ...newConfig };
    set({ whiteLabel: updated });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('rotta_branding', JSON.stringify(updated));
    }
    applyBrandColor(updated.primaryColor);
  },

  addReseller: (resellerData) => {
    const newReseller: Reseller = {
      ...resellerData,
      id: `res-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };
    set({ resellers: [newReseller, ...get().resellers] });
  },

  toggleResellerStatus: (id) => {
    const updated = get().resellers.map(r => {
      if (r.id === id) {
        return {
          ...r,
          accountStatus: (r.accountStatus === 'Ativa' ? 'Suspensa' : 'Ativa') as 'Ativa' | 'Suspensa'
        };
      }
      return r;
    });
    set({ resellers: updated });
  },

  setSessionExpired: (status) => set({ isSessionExpired: status }),

  addDevice: (deviceData) => {
    const devices = { ...get().devices };
    const newId = Math.max(0, ...Object.keys(devices).map(Number)) + 1;
    const now = new Date().toISOString();
    devices[newId] = {
      ...deviceData,
      id: newId,
      status: 'offline',
      disabled: false,
      lastUpdate: now,
      positionId: 0,
      groupId: 0,
      attributes: {},
    };
    set({ devices });
  },

  removeDevice: (id) => {
    const devices = { ...get().devices };
    delete devices[id];
    set({ devices });
  },

  loginAsRole: (role: UserRole) => {
    const now = new Date().toISOString();

    const mockPositions: Record<number, Position> = {
      1: { id: 1, deviceId: 1, protocol: 'demo', serverTime: now, deviceTime: now, fixTime: now, outdated: false, valid: true, latitude: -23.5505, longitude: -46.6333, altitude: 0, speed: 25, course: 120, address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP', accuracy: 0, network: {}, attributes: { batteryLevel: 100, ignition: true } },
      2: { id: 2, deviceId: 2, protocol: 'demo', serverTime: now, deviceTime: now, fixTime: now, outdated: true, valid: true, latitude: -22.9068, longitude: -43.1729, altitude: 0, speed: 0, course: 45, address: 'Av. Rio Branco, 156 - Centro, Rio de Janeiro - RJ', accuracy: 0, network: {}, attributes: { batteryLevel: 80, ignition: false } },
      3: { id: 3, deviceId: 3, protocol: 'demo', serverTime: now, deviceTime: now, fixTime: now, outdated: false, valid: true, latitude: -19.9167, longitude: -43.9345, altitude: 0, speed: 12, course: 310, address: 'Praça da Liberdade, Belo Horizonte - MG', accuracy: 0, network: {}, attributes: { batteryLevel: 45, ignition: true } },
    };

    const allDevices: Record<number, Device> = {
      1: { id: 1, name: 'HB20 Branco (ABC-1D23)', uniqueId: '358912345678901', status: 'online', disabled: false, lastUpdate: now, positionId: 1, groupId: 0, phone: '(11) 98888-0001', model: 'Teltonika FMB920', contact: 'Carlos Silva', category: 'car', attributes: {} },
      2: { id: 2, name: 'Caminhão FH540 (XYZ-9876)', uniqueId: '358912345678902', status: 'offline', disabled: false, lastUpdate: now, positionId: 2, groupId: 0, phone: '(11) 98888-0002', model: 'Suntech ST310U', contact: 'Transportes ABC', category: 'truck', attributes: {} },
      3: { id: 3, name: 'Moto Honda CG 160 (MOT-4321)', uniqueId: '358912345678903', status: 'stopped', disabled: false, lastUpdate: now, positionId: 3, groupId: 0, phone: '(11) 98888-0003', model: 'Coban TK303G', contact: 'Entregas Rápidas', category: 'motorcycle', attributes: {} },
    };

    // Role-specific settings
    if (role === 'admin') {
      set({
        user: {
          id: 1,
          name: 'Super Admin Rotta',
          email: 'admin@rotta.app',
          readonly: false,
          administrator: true,
          role: 'admin',
          isDemo: true,
          map: '',
          latitude: -14.235,
          longitude: -51.925,
          zoom: 4
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        devices: allDevices,
        positions: mockPositions,
        selectedDeviceId: 1
      });
    } else if (role === 'manager') {
      set({
        user: {
          id: 2,
          name: 'AutoTrack (Revendedora)',
          email: 'gestor@rotta.app',
          readonly: false,
          administrator: false,
          role: 'manager',
          isDemo: true,
          resellerId: 'res-1',
          map: '',
          latitude: -14.235,
          longitude: -51.925,
          zoom: 4
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        devices: allDevices,
        positions: mockPositions,
        selectedDeviceId: 1
      });
    } else {
      // 'user' (Dono do carro / Cliente final)
      // Vê estritamente o próprio veículo
      const singleDevice: Record<number, Device> = { 1: allDevices[1] };
      const singlePosition: Record<number, Position> = { 1: mockPositions[1] };

      set({
        user: {
          id: 3,
          name: 'Carlos Ferreira (Cliente)',
          email: 'cliente@email.com',
          readonly: true,
          administrator: false,
          role: 'user',
          isDemo: true,
          assignedDeviceId: 1,
          map: '',
          latitude: -23.5505,
          longitude: -46.6333,
          zoom: 15
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        devices: singleDevice,
        positions: singlePosition,
        selectedDeviceId: 1
      });
    }
  },

  loginAsDemo: () => {
    // Por padrão no botão de demonstração rápida, abre como Gestor de Revendedora (Manager)
    get().loginAsRole('manager');
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const user = await traccarService.login(email, password);
      // Determine user role based on Traccar permissions
      const role: UserRole = user.administrator ? 'admin' : (user.userLimit !== 0 || user.deviceLimit !== 0 ? 'manager' : 'user');
      const authenticatedUser: User = { ...user, role, isDemo: false };
      set({ 
        user: authenticatedUser, 
        isAuthenticated: true, 
        isLoading: false,
        error: null,
        isSessionExpired: false 
      });
      await get().fetchInitialData();
      get().connectWebSocket();
      return authenticatedUser;
    } catch (err: any) {
      set({ 
        error: err.message || 'Credenciais inválidas. Verifique os dados informados.', 
        isLoading: false, 
        isAuthenticated: false 
      });
      throw err;
    }
  },

  logout: async () => {
    try {
      if (!get().user?.isDemo) {
        await traccarService.logout();
      }
    } catch (e) {
      // Ignore logout errors
    } finally {
      get().disconnectWebSocket();
      set({ user: null, isAuthenticated: false, devices: {}, positions: {}, selectedDeviceId: null });
    }
  },

  checkAuth: async () => {
    // If currently authenticated via demo mode, preserve state
    if (get().isAuthenticated && get().user?.isDemo) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const user = await traccarService.checkSession();
      const role: UserRole = user.administrator ? 'admin' : (user.userLimit !== 0 || user.deviceLimit !== 0 ? 'manager' : 'user');
      set({ user: { ...user, role, isDemo: false }, isAuthenticated: true, isSessionExpired: false });
      await get().fetchInitialData();
      get().connectWebSocket();
    } catch (err) {
      // Not authenticated with Traccar backend session - silently clear state
      set({ user: null, isAuthenticated: false, isSessionExpired: false });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchInitialData: async () => {
    const state = get();
    // Do not call Traccar API if unauthenticated or in Demo mode
    if (!state.isAuthenticated || state.user?.isDemo) {
      return;
    }

    try {
      const [devices, positions] = await Promise.all([
        traccarService.getDevices(),
        traccarService.getPositions()
      ]);

      const devicesMap: Record<number, Device> = {};
      devices.forEach((d) => {
        devicesMap[d.id] = {
          ...d,
          id: d.id,
          name: d.name,
          status: d.status || 'offline',
        };
      });

      const positionsMap: Record<number, Position> = {};
      positions.forEach((p) => {
        positionsMap[p.deviceId] = p;
      });

      set({ devices: devicesMap, positions: positionsMap });

      // Automatically select device if none selected
      const currentSelected = get().selectedDeviceId;
      if (!currentSelected || !devicesMap[currentSelected]) {
        if (devices.length > 0) {
          set({ selectedDeviceId: devices[0].id });
        }
      }
    } catch (err: any) {
      // If 401 occurs during fetch, cleanly reset auth if unauthenticated
      if (err?.message?.includes('401') || err?.message?.includes('expirou')) {
        const isDemo = get().user?.isDemo;
        if (!isDemo) {
          set({ isAuthenticated: false, user: null });
        }
      }
      console.warn('Initial data fetch notice:', err?.message || err);
    }
  },

  connectWebSocket: () => {
    const state = get();
    if (!state.isAuthenticated || state.user?.isDemo) {
      return;
    }
    const envUrl = (import.meta.env.VITE_TRACCAR_URL || '').trim();
    if (!envUrl) {
      return;
    }
    const baseUrl = envUrl.replace(/\/+$/, '');
    const wsUrl = baseUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:') + '/api/socket';

    try {
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        // WebSocket connected
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.devices) {
            const devicesMap = { ...get().devices };
            data.devices.forEach((d: Device) => {
              devicesMap[d.id] = { ...devicesMap[d.id], ...d };
            });
            set({ devices: devicesMap });
          }
          
          if (data.positions) {
            const positionsMap = { ...get().positions };
            data.positions.forEach((p: Position) => {
              positionsMap[p.deviceId] = p;
            });
            set({ positions: positionsMap });
          }
        } catch {
          // Ignore parsing errors
        }
      };

      socket.onerror = () => {
        // WebSocket connection notice
      };

      socket.onclose = () => {
        // WebSocket closed
      };

      set({ socket });
    } catch {
      // WebSocket fallback
    }
  },

  disconnectWebSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null });
    }
  },

  selectDevice: (id) => set({ selectedDeviceId: id }),
  clearError: () => set({ error: null })
}));
