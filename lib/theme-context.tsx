"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { resolveTheme, type Theme } from "./theme-logic";

export type { Theme } from "./theme-logic";
const STORAGE_KEY = "balagh-theme";
const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void } | undefined>(undefined);

function applyTheme(theme: Theme) { document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  useEffect(() => { const next = resolveTheme(window.localStorage.getItem(STORAGE_KEY), window.matchMedia("(prefers-color-scheme: dark)").matches); applyTheme(next); const timer = window.setTimeout(() => setThemeState(next), 0); return () => window.clearTimeout(timer); }, []);
  const setTheme = useCallback((next: Theme) => { applyTheme(next); window.localStorage.setItem(STORAGE_KEY, next); setThemeState(next); }, []);
  const toggleTheme = useCallback(() => setTheme(theme === "light" ? "dark" : "light"), [setTheme, theme]);
  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
export function useTheme() { const value = useContext(ThemeContext); if (!value) throw new Error("useTheme must be used within ThemeProvider"); return value; }
