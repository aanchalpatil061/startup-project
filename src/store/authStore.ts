import { create } from 'zustand';
import type { AppUser } from '../types/auth';
import { storage } from '../utils/storage';

interface AuthState {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: AppUser, token: string, refreshToken: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  hydrate: () => Promise<void>;
  updateUser: (partial: Partial<AppUser>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, token, refreshToken) => {
    await storage.setToken(token);
    await storage.setRefreshToken(refreshToken);
    await storage.setUser(user);
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: async () => {
    await storage.clearAll();
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: async () => {
    try {
      const [token, user] = await Promise.all([storage.getToken(), storage.getUser()]);
      if (token && user) {
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  updateUser: (partial) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...partial } as AppUser;
    set({ user: updated });
    storage.setUser(updated);
  },
}));
