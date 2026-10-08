"use client";

import { createContext, useContext, useEffect } from "react";

type Theme = "dark" | "light";

const darkTheme = { theme: "dark" as const, setTheme: (_theme: Theme) => {} };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }, []);

  return <ThemeContext.Provider value={darkTheme}>{children}</ThemeContext.Provider>;
}

const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void } | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
