"use client";

import { useLocale } from "@/lib/locale-context";

export function LanguageSwitch({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  const { locale, setLocale } = useLocale();
  const baseButton = "rounded px-2 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-teal";
  const active = dark ? "bg-brass/20 text-white" : "bg-ink text-white";
  const inactive = dark ? "text-white/60 hover:text-white" : "text-muted hover:text-ink";
  return <div className="inline-flex gap-1"><button type="button" onClick={() => setLocale("ar")} className={`${baseButton} ${locale === "ar" ? active : inactive}`} aria-label="العربية">{compact ? "ع" : "العربية"}</button><button type="button" onClick={() => setLocale("en")} className={`${baseButton} ${locale === "en" ? active : inactive}`} aria-label="English">EN</button></div>;
}
