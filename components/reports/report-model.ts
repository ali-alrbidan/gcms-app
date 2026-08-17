import type { ComplaintStatus } from "@/types/api";
import type { ComplaintTrendMetric, PriorityReportMetric, ReportFilters, SlaPerformanceReport } from "@/types/reports";

export const REPORT_STATUSES: ComplaintStatus[] = ["submitted", "under_review", "assigned", "in_progress", "waiting_citizen", "resolved", "closed", "rejected", "escalated"];

export const STATUS_COLORS: Record<ComplaintStatus, string> = {
  submitted: "#5E7084",
  under_review: "#B8862B",
  assigned: "#009199",
  in_progress: "#006B70",
  waiting_citizen: "#8B5CF6",
  resolved: "#009199",
  closed: "#082248",
  rejected: "#A33B2E",
  escalated: "#EA580C",
};

export const CHART_COLORS = ["#009199", "#082248", "#B8862B", "#8B5CF6", "#EA580C", "#5E7084", "#A33B2E"];

export function formatDuration(minutes?: number | null): string {
  if (minutes === null || minutes === undefined || !Number.isFinite(minutes)) return "—";
  const value = Math.max(0, Math.round(minutes));
  if (value < 60) return `${value} min`;
  const hours = Math.floor(value / 60);
  const remainder = value % 60;
  if (hours < 24) return remainder ? `${hours} h ${remainder} min` : `${hours} h`;
  const days = Math.floor(hours / 24);
  return hours % 24 ? `${days} d ${hours % 24} h` : `${days} d`;
}

export function compliance(sla?: Pick<SlaPerformanceReport, "total_with_sla" | "breach_rate">): number | null {
  if (!sla || sla.total_with_sla <= 0) return null;
  return Math.max(0, Math.min(100, 100 - sla.breach_rate));
}

export function percentage(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 10000) / 100 : 0;
}

export function prioritySlices(rows: PriorityReportMetric[]) {
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  return rows.filter((row) => row.total > 0).map((row, index) => ({ ...row, percentage: percentage(row.total, total), color: CHART_COLORS[index % CHART_COLORS.length] }));
}

export function orderedTrends(rows: ComplaintTrendMetric[]): ComplaintTrendMetric[] {
  return [...rows].sort((a, b) => a.period.localeCompare(b.period));
}

export function presetFilters(preset: "7d" | "30d" | "90d" | "month", now = new Date()): Pick<ReportFilters, "date_from" | "date_to"> {
  const end = new Date(now);
  const start = new Date(now);
  if (preset === "month") start.setDate(1);
  else start.setDate(start.getDate() - (preset === "7d" ? 6 : preset === "30d" ? 29 : 89));
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  return { date_from: iso(start), date_to: iso(end) };
}

export function complaintWorkspaceHref(id: string | number): string {
  return `/complaint-workspace/${id}`;
}
