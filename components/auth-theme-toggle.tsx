"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type AuthTheme = "light" | "dark";

const storageKey = "trading-journal-auth-theme";

export function AuthThemeToggle() {
  const [theme, setTheme] = useState<AuthTheme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const initialTheme: AuthTheme = saved === "light" ? "light" : "dark";
    document.documentElement.dataset.authTheme = initialTheme;
    setTheme(initialTheme);
  }, []);

  function selectTheme(nextTheme: AuthTheme) {
    document.documentElement.dataset.authTheme = nextTheme;
    window.localStorage.setItem(storageKey, nextTheme);
    setTheme(nextTheme);
  }

  return (
    <div className="auth-theme-switch" role="group" aria-label="Appearance">
      <button type="button" className="auth-theme-option" onClick={() => selectTheme("light")} aria-label="Light mode" aria-pressed={theme === "light"} title="Light mode"><Sun className="h-4 w-4" /></button>
      <button type="button" className="auth-theme-option" onClick={() => selectTheme("dark")} aria-label="Dark mode" aria-pressed={theme === "dark"} title="Dark mode"><Moon className="h-4 w-4" /></button>
    </div>
  );
}
