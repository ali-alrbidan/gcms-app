// import { RoleGuard } from "@/lib/role-guard";
// import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

// const navItems: NavItem[] = [{ label: "لوحة العمل", href: "/employee" }];

// export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <RoleGuard role="employee">
//       <DashboardShell navItems={navItems} sectionLabel="لوحة الموظف">
//         {children}
//       </DashboardShell>
//     </RoleGuard>
//   );
// }

import { RoleGuard } from "@/lib/role-guard";
import { DashboardShell } from "@/components/dashboard-shell";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role="employee">
      <DashboardShell role="employee">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
