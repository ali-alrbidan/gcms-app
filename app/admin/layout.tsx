import { RoleGuard } from "@/lib/role-guard";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const navItems: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Departments", href: "/admin/departments" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Priorities", href: "/admin/priorities" },
  { label: "SLA rules", href: "/admin/sla-rules" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="admin">
      <DashboardShell navItems={navItems} sectionLabel="Admin console">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
