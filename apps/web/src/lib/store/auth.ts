import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'venue_owner' | 'customer_support' | 'user';
  email_verified: boolean;
  phone?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user }),

      setToken: (token) => {
        Cookies.set('auth-token', token, { expires: 7, secure: true, sameSite: 'strict' });
        set({ token });
      },

      login: (user, token) => {
        Cookies.set('auth-token', token, { expires: 7, secure: true, sameSite: 'strict' });
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      },

      logout: () => {
        Cookies.remove('auth-token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      clearAuth: () => {
        Cookies.remove('auth-token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      },
    }),
    {
      name: 'myjuntar-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);