"use client";

import { use } from "react";
import { ComplaintWorkspace } from "@/components/complaint-workspace/complaint-workspace";
import { StaffDashboardShell } from "@/components/staff-dashboard-shell";

/**
 * Deliberately unlinked staff-only route. Access is enforced by the existing
 * authenticated API client and the role-aware workspace component.
 */
export default function ComplaintWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <StaffDashboardShell><ComplaintWorkspace id={id} /></StaffDashboardShell>;
}
