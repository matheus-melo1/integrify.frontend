import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { prefixedLocalStorage } from "@/shared/lib/storage";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type LoginTransition = "idle" | "expanding" | "fading";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  refreshExpiresAt: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  refreshExpiresAt: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loginTransition: LoginTransition;
  setAuth: (tokens: AuthTokens, user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  startLoginTransition: () => void;
  advanceToFading: () => void;
  endLoginTransition: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      expiresAt: null,
      refreshExpiresAt: null,
      user: null,
      isAuthenticated: false,
      loginTransition: "idle",
      setAuth: (tokens, user) =>
        set({
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
          refreshExpiresAt: tokens.refreshExpiresAt,
          user,
          isAuthenticated: true,
        }),
      setTokens: (tokens) =>
        set({
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
          refreshExpiresAt: tokens.refreshExpiresAt,
        }),
      logout: () =>
        set({
          token: null,
          refreshToken: null,
          expiresAt: null,
          refreshExpiresAt: null,
          user: null,
          isAuthenticated: false,
          loginTransition: "idle",
        }),
      startLoginTransition: () => set({ loginTransition: "expanding" }),
      advanceToFading: () => set({ loginTransition: "fading" }),
      endLoginTransition: () => set({ loginTransition: "idle" }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => prefixedLocalStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        refreshExpiresAt: state.refreshExpiresAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
