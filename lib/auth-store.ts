import { api } from "@/services/api";
import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string; // TAMBAHKAN INI (optional)
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.login(username, password);
      set({
        user: response.data?.user || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.register(username, email, password);
      set({
        user: response.data?.user || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.logout();
    } catch (error) {
      // Tetap logout meskipun API gagal
    }
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = api.getToken();
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      const response = await api.getMe();
      set({
        user: response.data?.user || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      api.clearToken();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
