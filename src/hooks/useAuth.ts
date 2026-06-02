import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, setAuth, clearAuth, updateUser } = useAuthStore();
  return { user, token, isAuthenticated, isLoading, setAuth, clearAuth, updateUser };
};
