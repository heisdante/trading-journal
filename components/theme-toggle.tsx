"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const storageKey = "trading-journal-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    syncTheme();
    window.addEventListener("journal-theme-change", syncTheme);
    return () => window.removeEventListener("journal-theme-change", syncTheme);
  }, []);

  function selectTheme(next: Theme) {
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(storageKey, next);
    setTheme(next);
    window.dispatchEvent(new Event("journal-theme-change"));
  }

  return <div className="auth-theme-switch" role="group" aria-label="Appearance">
    <button type="button" className="auth-theme-option" onClick={() => selectTheme("light")} aria-label="Light mode" aria-pressed={theme === "light"} title="Light mode"><Sun className="h-4 w-4" /></button>
    <button type="button" className="auth-theme-option" onClick={() => selectTheme("dark")} aria-label="Dark mode" aria-pressed={theme === "dark"} title="Dark mode"><Moon className="h-4 w-4" /></button>
  </div>;
}
