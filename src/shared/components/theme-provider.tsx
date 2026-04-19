import { createContext, useContext, useEffect, type ReactNode } from "react";

type Theme = "dark";

type ThemeProviderState = {
  theme: Theme;
};

const initialState: ThemeProviderState = {
  theme: "dark",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  }, []);

  return (
    <ThemeProviderContext.Provider value={initialState}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeProviderContext);
