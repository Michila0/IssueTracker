import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

interface AuthResponse extends AuthUser {
  token: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initAuth: () => void;
}

const TOKEN_KEY = 'issue-tracker-token';
const USER_KEY = 'issue-tracker-user';

const persistAuth = (auth: AuthResponse) => {
  window.localStorage.setItem(TOKEN_KEY, auth.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify({ _id: auth._id, name: auth.name, email: auth.email }));
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
      persistAuth(data);
      set({
        user: { _id: data._id, name: data.name, email: data.email },
        token: data.token,
        loading: false,
        error: null,
        initialized: true,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Failed to log in',
      });
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.post<AuthResponse>('/auth/register', { name, email, password });
      persistAuth(data);
      set({
        user: { _id: data._id, name: data.name, email: data.email },
        token: data.token,
        loading: false,
        error: null,
        initialized: true,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Failed to create account',
      });
    }
  },

  logout: () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, loading: false, error: null, initialized: true });
  },

  initAuth: () => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    const storedUser = window.localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      set({
        token: storedToken,
        user: JSON.parse(storedUser) as AuthUser,
        initialized: true,
      });
      return;
    }

    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, initialized: true });
  },
}));