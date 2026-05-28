import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/features/auth/services/auth.service";

interface AuthContextProps {
  isLogged: boolean | null;
  setIsLogged: (isLogged: boolean) => void;
  onLogout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    const { expiresAt, refreshToken } = useAuthStore.getState();

    if (!expiresAt) {
      setIsLogged(false);
      return;
    }

    if (Date.now() < new Date(expiresAt).getTime()) {
      setIsLogged(true);
      return;
    }

    if (!refreshToken) {
      useAuthStore.getState().logout();
      setIsLogged(false);
      return;
    }

    const onRefreshToken = async () => {
      try {
        const tokens = await authService.refresh({
          refresh_token: refreshToken,
        });

        useAuthStore.getState().setTokens({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: tokens.expires_at,
          refreshExpiresAt: tokens.refresh_expires_at,
        });
        setIsLogged(true);
      } catch {
        useAuthStore.getState().logout();
        setIsLogged(false);
      }
    };

    onRefreshToken();
  }, []);

  const onLogout = async () => {
    useAuthStore.getState().logout();
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthentication = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthentication must be used within an AuthProvider");
  }
  return context;
};
