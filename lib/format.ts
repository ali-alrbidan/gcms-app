"use client";

import type { Locale } from "@/lib/i18n";

const LOCALE_TAG: Record<Locale, string> = {
  ar: "ar-EG",
  en: "en-US",
};

type DateFormatKind = "date" | "dateTime" | "longDateTime";

const FORMAT_OPTIONS: Record<DateFormatKind, Intl.DateTimeFormatOptions> = {
  date: { year: "numeric", month: "short", day: "numeric" },
  dateTime: {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
  longDateTime: {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
};

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatterFor(
  kind: DateFormatKind,
  locale: Locale,
): Intl.DateTimeFormat {
  const cacheKey = `${kind}:${locale}`;
  let fmt = formatterCache.get(cacheKey);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(LOCALE_TAG[locale], FORMAT_OPTIONS[kind]);
    formatterCache.set(cacheKey, fmt);
  }
  return fmt;
}

function toValidDate(date?: string | null): Date | null {
  if (!date) return null;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(
  date: string | null | undefined,
  locale: Locale,
): string {
  const parsed = toValidDate(date);
  return parsed ? formatterFor("date", locale).format(parsed) : "—";
}

export function formatDateTime(
  date: string | null | undefined,
  locale: Locale,
): string {
  const parsed = toValidDate(date);
  return parsed ? formatterFor("dateTime", locale).format(parsed) : "—";
}

export function formatLongDateTime(
  date: string | null | undefined,
  locale: Locale,
): string {
  const parsed = toValidDate(date);
  return parsed ? formatterFor("longDateTime", locale).format(parsed) : "—";
}
