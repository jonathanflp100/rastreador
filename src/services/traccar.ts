import type { User, Device, Position, ReportSummary, Geofence } from '../types/traccar';

// Retrieve the Traccar base URL strictly from import.meta.env.VITE_TRACCAR_URL without hardcoded URLs
const getTraccarBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_TRACCAR_URL || '').trim();
  if (!envUrl) {
    throw new Error('CONFIG_ERROR: Variável VITE_TRACCAR_URL não configurada no ambiente.');
  }
  return envUrl.replace(/\/+$/, '');
};

// Helper to handle API responses using full absolute URL from VITE_TRACCAR_URL
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getTraccarBaseUrl();
  const fullUrl = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const isSessionEndpoint = endpoint.startsWith('/api/session');
  const isLogin = isSessionEndpoint && options.method === 'POST';
  
  // Log every API call with the full absolute URL for easy debugging
  console.log(`[Traccar API] ${options.method || 'GET'} -> ${fullUrl}`);

  // Traccar requires credentials to be included to send and maintain the session cookie
  const mergedOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  let response: Response;
  try {
    response = await fetch(fullUrl, mergedOptions);
  } catch (err: any) {
    // Distinguish network failure (fetch rejected / connection refused / CORS blocked)
    const errorDetail = err?.message || 'Falha de rede';
    throw new Error(`Erro de Conexão: Não foi possível alcançar o servidor Traccar (${fullUrl}). Verifique sua conexão e o status do túnel/servidor. [Detalhe: ${errorDetail}]`);
  }
  
  if (response.status === 401) {
    if (isSessionEndpoint) {
      if (isLogin) {
        throw new Error('Erro 401 (Não autorizado): E-mail ou senha incorretos no servidor Traccar.');
      }
      throw new Error('Não autenticado.');
    }

    try {
      const { useTraccarStore } = await import('../store/useTraccarStore');
      const state = useTraccarStore.getState();
      if (state.isAuthenticated && !state.user?.isDemo && !state.isLoading) {
        state.setSessionExpired(true);
      }
    } catch {
      // Ignore store import error
    }
    throw new Error('Sua sessão expirou (401). Faça login novamente.');
  }

  if (response.status === 404) {
    throw new Error(`Erro 404 (Não Encontrado): O endpoint solicitado (${endpoint}) não existe no servidor Traccar.`);
  }

  if (response.status >= 500) {
    let serverErrorText = '';
    try {
      serverErrorText = await response.text();
    } catch {
      // Ignore body read error
    }
    throw new Error(`Erro ${response.status} (Servidor Traccar): O servidor remoto encontrou um erro interno. ${serverErrorText ? `[${serverErrorText.slice(0, 100)}]` : ''}`);
  }
  
  if (!response.ok) {
    let errorMsg = '';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.message || JSON.stringify(errorJson);
    } catch {
      errorMsg = await response.text().catch(() => '');
    }
    throw new Error(errorMsg || `Erro HTTP ${response.status} na API Traccar (${response.statusText})`);
  }
  
  // Some endpoints return empty body (e.g. POST /api/session for logout, or 204)
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

export const traccarService = {
  // Auth
  login: async (email: string, password: string): Promise<User> => {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);
    
    return fetchApi<User>('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
  },
  
  logout: async (): Promise<void> => {
    return fetchApi<void>('/api/session', {
      method: 'DELETE',
    });
  },
  
  checkSession: async (): Promise<User> => {
    return fetchApi<User>('/api/session');
  },

  // Devices
  getDevices: async (): Promise<Device[]> => {
    return fetchApi<Device[]>('/api/devices');
  },

  // Positions
  getPositions: async (): Promise<Position[]> => {
    return fetchApi<Position[]>('/api/positions');
  },

  // Commands
  sendCommand: async (deviceId: number, type: string, attributes: Record<string, any> = {}): Promise<any> => {
    return fetchApi<any>('/api/commands/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId,
        type,
        attributes,
      }),
    });
  },

  // Reports
  getSummary: async (deviceId: number, from: string, to: string): Promise<ReportSummary[]> => {
    return fetchApi<ReportSummary[]>(`/api/reports/summary?deviceId=${deviceId}&from=${from}&to=${to}`);
  },

  // Geofences
  getGeofences: async (): Promise<Geofence[]> => {
    return fetchApi<Geofence[]>('/api/geofences');
  }
};
