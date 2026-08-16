"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translate, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "gcms_locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string) => string;
  tFn: <A extends unknown[]>(path: string) => (...args: A) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial: Locale = stored === "en" ? "en" : "ar";
    setLocaleState(initial);
    applyDocumentLocale(initial);
  }, []);

  //   const  setLocale = useCallback((l: Locale) => {
  //     setLocaleState(l);
  //     window.localStorage.setItem(STORAGE_KEY, l);
  //     applyDocumentLocale(l);
  //   }, []);

  const setLocale = useCallback(
    (l: Locale) => {
      if (l === locale) return;
      window.localStorage.setItem(STORAGE_KEY, l);
      applyDocumentLocale(l);
      // Force a full reload so every page refetches its data with the
      // correct Accept-Language header instead of showing stale content.
      window.location.reload();
    },
    [locale],
  );
  //   const t = useCallback((path: string) => translate(locale, path), [locale]);
  const tFn = useCallback(
    <A extends unknown[]>(path: string) =>
      translate(locale, path) as (...args: A) => string,
    [locale],
  );
  const t = useCallback(
    (path: string) => translate(locale, path) as string,
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, tFn }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
