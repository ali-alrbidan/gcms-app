"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";

/** Provides the shared staff shell to routes outside /admin and /employee. */
export function StaffDashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); const { t } = useLocale(); const router = useRouter();
  const role = user?.role === "admin" || user?.role === "employee" ? user.role : null;

  useEffect(() => {
    if (loading || role) return;
    router.replace(user ? `/${user.role}` : "/login");
  }, [loading, role, router, user]);

  if (loading || !role) return <div className="flex min-h-screen items-center justify-center bg-paper"><p className="text-sm text-muted">{t("roleGuard.checking")}</p></div>;
  return <DashboardShell role={role}>{children}</DashboardShell>;
}
