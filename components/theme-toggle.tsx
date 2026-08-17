"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/locale-context";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme(); const { locale } = useLocale();
  const toDark = locale === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to dark mode"; const toLight = locale === "ar" ? "التبديل إلى الوضع الفاتح" : "Switch to light mode";
  return <button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? toLight : toDark} aria-pressed={theme === "dark"} title={theme === "dark" ? toLight : toDark} className={`relative inline-flex h-9 items-center rounded-full border border-line bg-paper p-1 text-muted transition-colors duration-200 hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-teal ${compact ? "w-9 justify-center" : "w-[4.75rem] justify-between"}`}><Sun className={`z-10 h-4 w-4 transition-colors ${theme === "light" ? "text-amber" : ""}`} /><Moon className={`z-10 h-4 w-4 transition-colors ${theme === "dark" ? "text-teal" : ""}`} /><span aria-hidden className={`absolute h-7 w-7 rounded-full bg-surface shadow-sm transition-transform duration-200 ${theme === "dark" ? "translate-x-0 rtl:-translate-x-0 ltr:translate-x-[2.5rem]" : "translate-x-0 rtl:translate-x-[2.5rem]"}`} /></button>;
}
