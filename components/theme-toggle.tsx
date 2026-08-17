"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      className={`inline-flex min-h-11 items-center border border-terminal-line text-sm text-terminal-muted transition hover:border-terminal-cyan hover:text-terminal-cyan ${compact ? "w-11 justify-center" : "w-full justify-between gap-3 px-3"}`}
    >
      <span className={compact ? "sr-only" : "font-medium"}>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
      {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
