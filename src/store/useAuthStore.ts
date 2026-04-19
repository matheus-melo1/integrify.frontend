import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type LoginTransition = "idle" | "expanding" | "fading";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loginTransition: LoginTransition;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  startLoginTransition: () => void;
  advanceToFading: () => void;
  endLoginTransition: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      loginTransition: "idle",
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          loginTransition: "idle",
        }),
      startLoginTransition: () => set({ loginTransition: "expanding" }),
      advanceToFading: () => set({ loginTransition: "fading" }),
      endLoginTransition: () => set({ loginTransition: "idle" }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
