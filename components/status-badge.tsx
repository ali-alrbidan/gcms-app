// import type { ComplaintStatus } from "@/types/api";

// const STATUS_LABELS: Record<ComplaintStatus, string> = {
//   submitted: "مقدَّمة",
//   under_review: "قيد المراجعة",
//   assigned: "مسندة",
//   in_progress: "قيد التنفيذ",
//   resolved: "تم الحل",
//   closed: "مغلقة",
//   rejected: "مرفوضة",
// };

// const STATUS_STYLES: Record<ComplaintStatus, string> = {
//   submitted: "bg-muted/10 text-muted",
//   under_review: "bg-amber/10 text-amber",
//   assigned: "bg-brass/10 text-brass",
//   in_progress: "bg-amber/10 text-amber",
//   resolved: "bg-teal/10 text-teal",
//   closed: "bg-teal/10 text-teal",
//   rejected: "bg-brick/10 text-brick",
// };

// export const ALL_STATUSES: ComplaintStatus[] = [
//   "submitted",
//   "under_review",
//   "assigned",
//   "in_progress",
//   "resolved",
//   "closed",
//   "rejected",
// ];

// export function StatusBadge({ status }: { status: ComplaintStatus | string }) {
//   const key = status as ComplaintStatus;
//   const label = STATUS_LABELS[key] ?? status;
//   const style = STATUS_STYLES[key] ?? "bg-muted/10 text-muted";
//   return (
//     <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{label}</span>
//   );
// }

// export function statusLabel(status: ComplaintStatus | string): string {
//   return STATUS_LABELS[status as ComplaintStatus] ?? status;
// }

"use client";

import { useLocale } from "@/lib/locale-context";
import type { ComplaintStatus } from "@/types/api";

const STATUS_STYLES: Record<ComplaintStatus, string> = {
  submitted: "bg-muted/10 text-muted",
  under_review: "bg-amber/10 text-amber",
  assigned: "bg-brass/10 text-brass",
  in_progress: "bg-amber/10 text-amber",
  waiting_citizen: "bg-purple-500/10 text-purple-500",
  resolved: "bg-teal/10 text-teal",
  closed: "bg-teal/10 text-teal",
  rejected: "bg-brick/10 text-brick",
  escalated: "bg-orange-500/10 text-orange-500",
};

export const ALL_STATUSES: ComplaintStatus[] = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "waiting_citizen",
  "escalated",
  "resolved",
  "closed",
  "rejected",
];

export function useStatusLabel() {
  const { t } = useLocale();
  return (status: ComplaintStatus | string) => t(`statuses.${status}`);
}

export function StatusBadge({ status }: { status: ComplaintStatus | string }) {
  const label = useStatusLabel()(status);
  const style =
    STATUS_STYLES[status as ComplaintStatus] ?? "bg-muted/10 text-muted";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
