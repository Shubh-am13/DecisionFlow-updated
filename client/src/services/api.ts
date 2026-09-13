const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`
  : '/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserProfile;
}

// Token storage helpers
export const getToken = (): string | null => localStorage.getItem('crowdwise_token');
export const setToken = (token: string): void => localStorage.setItem('crowdwise_token', token);
export const removeToken = (): void => {
  localStorage.removeItem('crowdwise_token');
  localStorage.removeItem('crowdwise_user');
};

export const getSavedUser = (): UserProfile | null => {
  const data = localStorage.getItem('crowdwise_user');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const saveUser = (user: UserProfile): void => {
  localStorage.setItem('crowdwise_user', JSON.stringify(user));
};

const authHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getMe(): Promise<{ success: boolean; user?: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders(),
    });
    return res.json();
  },

  // Dilemmas
  async getDilemmas(category?: string, search?: string): Promise<any> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/dilemmas?${params.toString()}`);
    return res.json();
  },

  async getDilemmaById(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/dilemmas/${id}`);
    return res.json();
  },

  async createDilemma(payload: {
    title: string;
    description: string;
    category?: string;
    options?: Array<{ id: string; label: string; votes: number }>;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/dilemmas`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async addComment(dilemmaId: string, text: string): Promise<any> {
    const res = await fetch(`${API_BASE}/dilemmas/${dilemmaId}/comments`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ text }),
    });
    return res.json();
  },

  async voteDilemma(dilemmaId: string, option: string): Promise<any> {
    const res = await fetch(`${API_BASE}/dilemmas/${dilemmaId}/vote`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ option }),
    });
    return res.json();
  },

  async triggerAIConsensus(dilemmaId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/dilemmas/${dilemmaId}/ai-consensus`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return res.json();
  },
};
