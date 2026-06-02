import * as SecureStore from 'expo-secure-store';
import { Config } from '../constants/config';
import type { AppUser } from '../types/auth';

export const storage = {
  setToken: (token: string) => SecureStore.setItemAsync(Config.TOKEN_KEY, token),
  getToken: () => SecureStore.getItemAsync(Config.TOKEN_KEY),
  deleteToken: () => SecureStore.deleteItemAsync(Config.TOKEN_KEY),

  setRefreshToken: (token: string) => SecureStore.setItemAsync(Config.REFRESH_TOKEN_KEY, token),
  getRefreshToken: () => SecureStore.getItemAsync(Config.REFRESH_TOKEN_KEY),
  deleteRefreshToken: () => SecureStore.deleteItemAsync(Config.REFRESH_TOKEN_KEY),

  setUser: (user: AppUser) =>
    SecureStore.setItemAsync(Config.USER_KEY, JSON.stringify(user)),
  getUser: async (): Promise<AppUser | null> => {
    const raw = await SecureStore.getItemAsync(Config.USER_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  },
  deleteUser: () => SecureStore.deleteItemAsync(Config.USER_KEY),

  setOnboarded: () => SecureStore.setItemAsync(Config.ONBOARDING_KEY, 'true'),
  getOnboarded: async () => {
    const v = await SecureStore.getItemAsync(Config.ONBOARDING_KEY);
    return v === 'true';
  },

  clearAll: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(Config.TOKEN_KEY),
      SecureStore.deleteItemAsync(Config.REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(Config.USER_KEY),
    ]);
  },
};
