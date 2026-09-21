export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  readonly: boolean;
  administrator: boolean;
  userLimit?: number;
  deviceLimit?: number;
  role?: UserRole; // 'admin' = Super Admin Rotta, 'manager' = Revendedora / Dono de plataforma, 'user' = Cliente final
  resellerId?: string;
  assignedDeviceId?: number; // Para o papel 'user': id do único veículo que ele pode visualizar
  isDemo?: boolean;
  map?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  password?: string;
}

export interface WhiteLabelConfig {
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  supportPhone?: string;
  supportEmail?: string;
  customDomain?: string;
  domainStatus?: 'pending' | 'active' | 'unconfigured';
}

export interface Reseller {
  id: string;
  companyName: string;
  managerName: string;
  email: string;
  phone: string;
  plan: 'Start' | 'Pro (White-Label)' | 'Enterprise';
  activeVehicles: number;
  paymentStatus: 'Em dia' | 'Atrasado';
  accountStatus: 'Ativa' | 'Suspensa';
  createdAt: string;
  monthlyFee: number;
}

export interface Device {
  id: number;
  name: string;
  uniqueId: string;
  status: string;
  disabled: boolean;
  lastUpdate: string;
  positionId: number;
  groupId: number;
  phone: string;
  model: string;
  contact: string;
  category: string;
  attributes: Record<string, any>;
}

export interface Position {
  id: number;
  deviceId: number;
  protocol: string;
  serverTime: string;
  deviceTime: string;
  fixTime: string;
  outdated: boolean;
  valid: boolean;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  course: number;
  address: string;
  accuracy: number;
  network: Record<string, any>;
  attributes: {
    battery?: number;
    batteryLevel?: number;
    ignition?: boolean;
    motion?: boolean;
    totalDistance?: number;
    hours?: number;
    [key: string]: any;
  };
}

export interface ReportSummary {
  deviceId: number;
  deviceName: string;
  maxSpeed: number;
  averageSpeed: number;
  distance: number;
  spentFuel: number;
  engineHours: number;
}

export interface Geofence {
  id: number;
  name: string;
  description: string;
  area: string;
  attributes: Record<string, any>;
}
