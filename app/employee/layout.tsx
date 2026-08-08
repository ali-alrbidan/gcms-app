import { RoleGuard } from "@/lib/role-guard";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const navItems: NavItem[] = [{ label: "لوحة العمل", href: "/employee" }];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="employee">
      <DashboardShell navItems={navItems} sectionLabel="لوحة الموظف">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
