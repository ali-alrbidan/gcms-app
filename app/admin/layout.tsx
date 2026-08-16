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
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const navItems: NavItem[] = [
  { labelKey: "nav.overview", href: "/admin" },
  { labelKey: "nav.complaints", href: "/admin/complaints" },
  { labelKey: "nav.reports", href: "/admin/reports" },
  { labelKey: "nav.users", href: "/admin/users" },
  { labelKey: "nav.departments", href: "/admin/departments" },
  { labelKey: "nav.categories", href: "/admin/categories" },
  { labelKey: "nav.priorities", href: "/admin/priorities" },
  { labelKey: "nav.slaRules", href: "/admin/sla-rules" },
  { labelKey: "nav.classificationRules", href: "/admin/classification-rules" },
  { labelKey: "nav.notifications", href: "/admin/notifications" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role="admin">
      <DashboardShell navItems={navItems} sectionLabelKey="nav.adminConsole">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
