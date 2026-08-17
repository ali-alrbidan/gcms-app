// import { RoleGuard } from "@/lib/role-guard";
// import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

// const navItems: NavItem[] = [
//   { label: "Overview", href: "/admin" },
//   { label: "Complaints", href: "/admin/complaints" },
//   { label: "Reports", href: "/admin/reports" },
//   { label: "Departments", href: "/admin/departments" },
//   { label: "Categories", href: "/admin/categories" },
//   { label: "Priorities", href: "/admin/priorities" },
//   { label: "SLA rules", href: "/admin/sla-rules" },
//   { label: "Classification rules", href: "/admin/classification-rules" },
//   { label: "Notifications", href: "/admin/notifications" },
// ];

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <RoleGuard role="admin">
//       <DashboardShell navItems={navItems} sectionLabel="Admin console">
//         {children}
//       </DashboardShell>
//     </RoleGuard>
//   );
// }

import { RoleGuard } from "@/lib/role-guard";
import { DashboardShell } from "@/components/dashboard-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role="admin">
      <DashboardShell role="admin">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
