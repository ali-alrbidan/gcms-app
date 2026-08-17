import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  Clock3,
  FileText,
  Flag,
  LayoutDashboard,
  Tags,
  Users,
  Workflow,
} from "lucide-react";
import type { UserRole } from "@/types/api";

export type StaffRole = Extract<UserRole, "admin" | "employee">;

export interface DashboardNavItem {
  id: string;
  labelKey: string;
  href: string;
  icon: LucideIcon;
  match: "exact" | "prefix";
}

export const ADMIN_NAVIGATION: DashboardNavItem[] = [
  { id: "overview", labelKey: "nav.overview", href: "/admin", icon: LayoutDashboard, match: "exact" },
  { id: "complaints", labelKey: "nav.complaints", href: "/admin/complaints", icon: FileText, match: "prefix" },
  { id: "reports", labelKey: "nav.reports", href: "/admin/reports", icon: BarChart3, match: "prefix" },
  { id: "users", labelKey: "nav.users", href: "/admin/users", icon: Users, match: "prefix" },
  { id: "departments", labelKey: "nav.departments", href: "/admin/departments", icon: Building2, match: "prefix" },
  { id: "categories", labelKey: "nav.categories", href: "/admin/categories", icon: Tags, match: "prefix" },
  { id: "priorities", labelKey: "nav.priorities", href: "/admin/priorities", icon: Flag, match: "prefix" },
  { id: "sla-rules", labelKey: "nav.slaRules", href: "/admin/sla-rules", icon: Clock3, match: "prefix" },
  { id: "classification", labelKey: "nav.classificationRules", href: "/admin/classification-rules", icon: Workflow, match: "prefix" },
  { id: "notifications", labelKey: "nav.notifications", href: "/admin/notifications", icon: Bell, match: "prefix" },
];

export const EMPLOYEE_NAVIGATION: DashboardNavItem[] = [
  { id: "my-work", labelKey: "nav.myWork", href: "/employee", icon: BriefcaseBusiness, match: "prefix" },
];

export function navigationForRole(role: StaffRole): DashboardNavItem[] {
  return role === "admin" ? ADMIN_NAVIGATION : EMPLOYEE_NAVIGATION;
}

export function isNavigationActive(item: DashboardNavItem, pathname: string, role: StaffRole): boolean {
  if (pathname.startsWith("/complaint-workspace/")) {
    return role === "admin" ? item.id === "complaints" : item.id === "my-work";
  }
  return item.match === "exact" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
