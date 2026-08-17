"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut, Menu, X } from "lucide-react";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { isNavigationActive, navigationForRole, type StaffRole } from "@/lib/dashboard-navigation";
import { useLocale } from "@/lib/locale-context";

const COLLAPSED_KEY = "gcms_sidebar_collapsed";

function initials(name?: string | null) {
  return (name ?? "?").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function UserPanel({ collapsed, onLogout, loggingOut }: { collapsed: boolean; onLogout: () => void; loggingOut: boolean }) {
  const { user } = useAuth(); const { t } = useLocale();
  return <div className="border-t border-line p-3"><div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`} title={collapsed ? user?.name : undefined}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/15 text-xs font-bold text-teal">{initials(user?.name)}</span>{!collapsed && <div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{user?.name}</p><p className="truncate text-xs text-muted">{t(`roles.${user?.role ?? "employee"}`)}</p><p className="mt-0.5 truncate text-xs text-muted">{user?.email}</p></div>}</div><div className={`mt-3 flex ${collapsed ? "justify-center" : "justify-between"}`}><ThemeToggle compact={collapsed} /></div><button type="button" onClick={onLogout} disabled={loggingOut} className={`mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg text-sm font-medium text-ink transition hover:bg-brick/10 hover:text-brick focus:outline-none focus:ring-2 focus:ring-teal disabled:opacity-50 ${collapsed ? "w-full px-2" : "w-full px-3"}`} aria-label={t("common.signOut")} title={collapsed ? t("common.signOut") : undefined}><LogOut className="h-4 w-4" />{!collapsed && t("common.signOut")}</button></div>;
}

function Navigation({ role, collapsed, onNavigate }: { role: StaffRole; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname(); const { t } = useLocale();
  return <nav aria-label={t("shell.primaryNavigation")} className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto px-3 py-4"><ul className="space-y-1">{navigationForRole(role).map((item) => { const active = isNavigationActive(item, pathname, role); const Icon = item.icon; return <li key={item.id}><Link href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} title={collapsed ? t(item.labelKey) : undefined} className={`group relative flex min-h-10 items-center rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal ${collapsed ? "justify-center px-2" : "gap-3 px-3"} ${active ? "bg-teal/10 text-ink" : "text-muted hover:bg-paper hover:text-ink"}`}><Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-teal" : "text-muted group-hover:text-ink"}`} strokeWidth={1.8} />{!collapsed && <span className="truncate">{t(item.labelKey)}</span>}{active && <span aria-hidden className="absolute inset-y-2 start-0 w-1 rounded-e-full bg-teal" />}</Link></li>; })}</ul></nav>;
}

function Brand({ compact = false }: { compact?: boolean }) {
  const { t } = useLocale();
  return <div className={`border-b border-line ${compact ? "p-3" : "p-5"}`}><div className={`flex items-center ${compact ? "justify-center" : "gap-3"}`}><Image src="/logo.png" alt={t("appName")} width={compact ? 36 : 146} height={40} priority className="h-9 w-auto object-contain" />{!compact && <span className="min-w-0 border-s border-line ps-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">GCMS</span>}</div></div>;
}

export function DashboardShell({ role, children }: { role: StaffRole; children: React.ReactNode }) {
  const { logout } = useAuth(); const { locale, t } = useLocale(); const router = useRouter(); const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false); const [drawerOpen, setDrawerOpen] = useState(false); const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null); const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { const timer = window.setTimeout(() => setCollapsed(window.localStorage.getItem(COLLAPSED_KEY) === "true"), 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { if (!drawerOpen) return; const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setDrawerOpen(false); }; const previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; window.addEventListener("keydown", onKey); const timer = window.setTimeout(() => closeRef.current?.focus(), 0); return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); window.clearTimeout(timer); }; }, [drawerOpen]);
  useEffect(() => { const timer = window.setTimeout(() => setDrawerOpen(false), 0); return () => window.clearTimeout(timer); }, [pathname]);

  function setCollapsedState(value: boolean) { setCollapsed(value); window.localStorage.setItem(COLLAPSED_KEY, String(value)); }
  function closeDrawer(restoreFocus = false) { setDrawerOpen(false); if (restoreFocus) window.setTimeout(() => menuRef.current?.focus(), 0); }
  async function onLogout() { setLoggingOut(true); try { await logout(); router.push("/login"); } finally { setLoggingOut(false); } }
  const collapseIcon = locale === "ar" ? ChevronRight : ChevronLeft;
  const CollapseIcon = collapseIcon;

  return <div className="flex min-h-screen bg-paper"><aside className={`sticky top-0 hidden h-screen shrink-0 flex-col border-e border-line bg-surface transition-[width] duration-200 md:flex ${collapsed ? "w-20" : "w-64"}`}><Brand compact={collapsed} /><div className={`pt-4 ${collapsed ? "flex justify-center px-2" : "px-5"}`}><LanguageSwitch compact={collapsed} /></div><Navigation role={role} collapsed={collapsed} /><div className="px-3 pb-2"><button type="button" onClick={() => setCollapsedState(!collapsed)} className="hidden w-full items-center justify-center rounded-lg p-2 text-muted hover:bg-paper hover:text-ink focus:outline-none focus:ring-2 focus:ring-teal md:inline-flex" aria-label={collapsed ? t("shell.expandSidebar") : t("shell.collapseSidebar")} title={collapsed ? t("shell.expandSidebar") : t("shell.collapseSidebar")}><CollapseIcon className="h-4 w-4" /></button></div><UserPanel collapsed={collapsed} onLogout={onLogout} loggingOut={loggingOut} /></aside>
    <div className="flex min-w-0 flex-1 flex-col"><header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur md:hidden"><button ref={menuRef} type="button" onClick={() => setDrawerOpen(true)} className="rounded-lg p-2 text-ink hover:bg-paper focus:outline-none focus:ring-2 focus:ring-teal" aria-label={t("shell.openNavigation")} aria-controls="mobile-dashboard-navigation" aria-expanded={drawerOpen}><Menu className="h-5 w-5" /></button><Image src="/logo.png" alt={t("appName")} width={100} height={32} priority className="h-8 w-auto object-contain" /><LanguageSwitch /></header><main className="min-w-0 flex-1 px-4 py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">{children}</main></div>
    {drawerOpen && <div className="fixed inset-0 z-40 bg-ink/35 md:hidden" aria-hidden="true" onClick={() => closeDrawer(true)} />}
    <aside id="mobile-dashboard-navigation" aria-label={t("shell.primaryNavigation")} className={`fixed inset-y-0 start-0 z-40 flex w-[min(20rem,86vw)] flex-col border-e border-line bg-surface shadow-2xl transition-transform duration-200 md:hidden ${drawerOpen ? "translate-x-0" : locale === "ar" ? "translate-x-full" : "-translate-x-full"}`}><div className="flex items-center justify-between"><Brand /><button ref={closeRef} type="button" onClick={() => closeDrawer(true)} className="me-3 rounded-lg p-2 text-muted hover:bg-paper hover:text-ink focus:outline-none focus:ring-2 focus:ring-teal" aria-label={t("shell.closeNavigation")}><X className="h-5 w-5" /></button></div><div className="px-5 pb-2"><LanguageSwitch /></div><Navigation role={role} collapsed={false} onNavigate={() => closeDrawer(false)} /><UserPanel collapsed={false} onLogout={onLogout} loggingOut={loggingOut} /></aside>
  </div>;
}
