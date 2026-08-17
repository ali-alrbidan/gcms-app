import { describe, expect, it } from "vitest";
import { complaintWorkspaceHref, compliance, formatDuration, orderedTrends, percentage, prioritySlices } from "../report-model";

describe("report presentation model", () => {
  it("formats minutes, hours, and days without inventing a duration", () => {
    expect(formatDuration(12)).toBe("12 min");
    expect(formatDuration(138)).toBe("2 h 18 min");
    expect(formatDuration(1680)).toBe("1 d 4 h");
    expect(formatDuration(null)).toBe("—");
  });

  it("calculates SLA compliance from the backend breach rate and handles no data", () => {
    expect(compliance({ total_with_sla: 10, breach_rate: 8 })).toBe(92);
    expect(compliance({ total_with_sla: 0, breach_rate: 0 })).toBeNull();
  });

  it("uses real priority totals when deriving chart percentages", () => {
    const slices = prioritySlices([
      { priority: { id: 1, name: "High", code: "high", level: 3 }, total: 3, open: 2, resolved: 1, sla_breached: 1, sla_breach_rate: 33.33 },
      { priority: { id: 2, name: "Low", code: "low", level: 1 }, total: 1, open: 1, resolved: 0, sla_breached: 0, sla_breach_rate: 0 },
    ]);
    expect(slices.map((slice) => slice.percentage)).toEqual([75, 25]);
    expect(percentage(0, 0)).toBe(0);
  });

  it("sorts backend trend periods chronologically and tolerates empty data", () => {
    expect(orderedTrends([])).toEqual([]);
    expect(orderedTrends([
      { period: "2026-08-01", created: 1, resolved: 0, closed: 0, sla_breached: 0 },
      { period: "2026-07-01", created: 0, resolved: 1, closed: 0, sla_breached: 0 },
    ]).map((row) => row.period)).toEqual(["2026-07-01", "2026-08-01"]);
  });

  it("builds SLA breach complaint links from the backend complaint id", () => {
    expect(complaintWorkspaceHref(123)).toBe("/complaint-workspace/123");
  });
});
