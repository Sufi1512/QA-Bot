import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => {
    Cookies.remove('authToken');
    set({ user: null, token: null });
  },
  isAuthenticated: () => !!get().token,
}));