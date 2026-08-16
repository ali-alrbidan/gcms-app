"use client";

import { useLocale } from "@/lib/locale-context";

export function LanguageSwitch({ dark = false }: { dark?: boolean }) {
  const { locale, setLocale } = useLocale();

  const baseBtn = "rounded px-2 py-1 text-xs font-medium transition";
  const activeCls = dark ? "bg-brass/20 text-white" : "bg-ink text-white";
  const inactiveCls = dark
    ? "text-white/60 hover:text-white"
    : "text-muted hover:text-ink";

  return (
    <div className="inline-flex gap-1">
      <button
        type="button"
        onClick={() => setLocale("ar")}
        className={`${baseBtn} ${locale === "ar" ? activeCls : inactiveCls}`}
      >
        العربية
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`${baseBtn} ${locale === "en" ? activeCls : inactiveCls}`}
      >
        EN
      </button>
    </div>
  );
}
