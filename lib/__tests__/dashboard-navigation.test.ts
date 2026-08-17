import { describe, expect, it } from "vitest";
import { ADMIN_NAVIGATION, EMPLOYEE_NAVIGATION, isNavigationActive, navigationForRole } from "../dashboard-navigation";

const adminItem = (id: string) => ADMIN_NAVIGATION.find((item) => item.id === id)!;

describe("dashboard navigation", () => {
  it("uses exact matching for the admin overview and prefix matching for nested pages", () => {
    expect(isNavigationActive(adminItem("overview"), "/admin", "admin")).toBe(true);
    expect(isNavigationActive(adminItem("overview"), "/admin/reports", "admin")).toBe(false);
    expect(isNavigationActive(adminItem("complaints"), "/admin/complaints", "admin")).toBe(true);
    expect(isNavigationActive(adminItem("complaints"), "/admin/complaints/12", "admin")).toBe(true);
    expect(isNavigationActive(adminItem("reports"), "/admin/reports/weekly", "admin")).toBe(true);
  });

  it("maps the direct complaint workspace route to the appropriate staff section", () => {
    expect(isNavigationActive(adminItem("complaints"), "/complaint-workspace/12", "admin")).toBe(true);
    expect(isNavigationActive(adminItem("reports"), "/complaint-workspace/12", "admin")).toBe(false);
    expect(isNavigationActive(EMPLOYEE_NAVIGATION[0], "/complaint-workspace/12", "employee")).toBe(true);
  });

  it("keeps navigation role-specific", () => {
    expect(navigationForRole("admin").map((item) => item.id)).toContain("reports");
    expect(navigationForRole("employee").map((item) => item.id)).toEqual(["my-work"]);
  });
});
