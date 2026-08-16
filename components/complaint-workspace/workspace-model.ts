import type {
  Assignment,
  Attachment,
  Complaint,
  ComplaintStatus,
  StatusHistory,
  UserRole,
} from "@/types/api";

export const STATUS_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  submitted: ["under_review", "rejected"],
  under_review: ["assigned", "rejected", "escalated"],
  assigned: ["in_progress", "escalated"],
  in_progress: ["waiting_citizen", "resolved", "escalated"],
  waiting_citizen: ["in_progress", "resolved"],
  escalated: ["assigned", "in_progress", "resolved"],
  resolved: ["closed"],
  closed: [],
  rejected: [],
};

export const MAIN_PIPELINE: ComplaintStatus[] = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
];

export const BRANCH_STATUSES: ComplaintStatus[] = [
  "waiting_citizen",
  "escalated",
  "rejected",
];

export interface WorkspaceAction {
  id: ComplaintStatus;
  status: ComplaintStatus;
  requiresResponse: boolean;
  destructive: boolean;
}

/** Mirrors the status service plus each controller's request validator. */
export function availableWorkspaceActions(
  complaint: Complaint,
  role: Extract<UserRole, "admin" | "employee">,
  currentUserDepartmentId?: string | number | null,
): WorkspaceAction[] {
  const activeRequest = complaint.active_information_request;
  const isRespondedRequest = activeRequest?.status === "responded";
  let candidates = STATUS_TRANSITIONS[complaint.status] ?? [];

  // The status service requires a valid assigned employee before these states.
  // Assignment is a distinct admin mutation, except for the employee's explicit
  // under_review self-assignment path handled below.
  if (!complaint.assigned_employee_id) {
    candidates = candidates.filter(
      (status) => !["assigned", "in_progress", "waiting_citizen"].includes(status),
    );
  }

  if (complaint.status === "waiting_citizen" && !isRespondedRequest) {
    candidates = [];
  }

  if (role === "employee") {
    // Employee request validation deliberately excludes submitted/assigned/closed/rejected.
    const employeeAllowed: ComplaintStatus[] = [
      "under_review",
      "in_progress",
      "waiting_citizen",
      "resolved",
      "escalated",
    ];
    candidates = candidates.filter((status) => employeeAllowed.includes(status));

    // The employee controller performs this explicit self-assignment path only
    // from an unassigned, in-department under-review complaint.
    if (
      complaint.status === "under_review" &&
      !complaint.assigned_employee_id &&
      String(complaint.department_id ?? "") === String(currentUserDepartmentId ?? "")
    ) {
      candidates = ["in_progress"];
    }
  } else {
    // Admin assignment owns the under_review -> assigned transition. It is not
    // exposed as an unbound status button because the service requires an assignee.
    candidates = candidates.filter((status) => status !== "assigned");
  }

  return candidates.map((status) => ({
    id: status,
    status,
    requiresResponse: status === "waiting_citizen",
    destructive: status === "resolved" || status === "closed" || status === "rejected",
  }));
}

export function formatDuration(minutes?: number | null): string | null {
  if (minutes === null || minutes === undefined || !Number.isFinite(minutes)) return null;
  const value = Math.max(0, Math.floor(minutes));
  if (value < 60) return `${value} min`;
  const hours = Math.floor(value / 60);
  const remainingMinutes = value % 60;
  if (hours < 24) return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours ? `${days} d ${remainingHours} h` : `${days} d`;
}

export function elapsedMinutes(from?: string | null): number | null {
  if (!from) return null;
  const start = new Date(from).getTime();
  if (Number.isNaN(start)) return null;
  return Math.max(0, Math.floor((Date.now() - start) / 60000));
}

export type ActivityType = "created" | "status" | "assignment" | "request" | "response" | "attachment";

export interface ComplaintActivityEvent {
  id: string;
  type: ActivityType;
  timestamp: string | null;
  actor: string | null;
  title: string;
  note?: string | null;
  fromStatus?: string | null;
  toStatus?: string | null;
  durationMinutes?: number | null;
  assignment?: Assignment;
  attachment?: Attachment;
}

function validTime(value?: string | null): number {
  const time = value ? new Date(value).getTime() : Number.NaN;
  return Number.isNaN(time) ? -Infinity : time;
}

function responseHistoryMatches(history: StatusHistory, response: string | null | undefined): boolean {
  return Boolean(
    response &&
      history.from_status === "waiting_citizen" &&
      history.to_status === "waiting_citizen" &&
      history.note === response,
  );
}

/**
 * Creates a display-only audit model from fields present in ComplaintResource.
 * Historical information requests are intentionally absent: the API returns only
 * active_information_request, so this helper never invents previous messages.
 */
export function buildActivity(complaint: Complaint): ComplaintActivityEvent[] {
  const activeRequest = complaint.active_information_request;
  const histories = complaint.status_histories ?? complaint.timeline ?? [];
  const events: ComplaintActivityEvent[] = [
    {
      id: `created-${complaint.id}`,
      type: "created",
      timestamp: complaint.created_at ?? null,
      actor: complaint.citizen?.name ?? null,
      title: "Complaint submitted",
    },
  ];

  histories.forEach((history) => {
    if (activeRequest?.status === "responded" && responseHistoryMatches(history, activeRequest.response_message)) {
      return;
    }
    events.push({
      id: `status-${history.id}`,
      type: "status",
      timestamp: history.created_at ?? null,
      actor: history.changed_by ?? null,
      title:
        history.from_status === history.to_status
          ? "Case note recorded"
          : "Complaint status updated",
      note: history.note ?? null,
      fromStatus: history.from_status ?? null,
      toStatus: history.to_status ?? null,
      durationMinutes: history.duration_minutes ?? null,
    });
  });

  (complaint.assignments ?? []).forEach((assignment) => {
    events.push({
      id: `assignment-${assignment.id}`,
      type: "assignment",
      timestamp: assignment.assigned_at ?? assignment.created_at ?? null,
      actor: assignment.assigned_by?.name ?? null,
      title: `Assigned to ${assignment.assigned_to?.name ?? "employee"}`,
      note: assignment.note ?? null,
      assignment,
    });
  });

  if (activeRequest) {
    events.push({
      id: `request-${activeRequest.id}`,
      type: "request",
      timestamp: activeRequest.requested_at ?? null,
      actor: activeRequest.requested_by?.name ?? null,
      title: "Additional information requested",
      note: activeRequest.message,
    });
    if (activeRequest.status === "responded") {
      events.push({
        id: `response-${activeRequest.id}`,
        type: "response",
        timestamp: activeRequest.responded_at ?? null,
        actor: complaint.citizen?.name ?? null,
        title: "Citizen provided additional information",
        note: activeRequest.response_message ?? null,
      });
    }
  }

  (complaint.attachments ?? []).forEach((attachment, index) => {
    events.push({
      id: `attachment-${attachment.id ?? attachment.file_name ?? index}`,
      type: "attachment",
      timestamp: attachment.created_at ?? null,
      actor: attachment.uploaded_by ?? null,
      title: `Attachment uploaded: ${attachment.original_name ?? attachment.file_name ?? "file"}`,
      attachment,
    });
  });

  return events.sort((a, b) => {
    const timeDifference = validTime(b.timestamp) - validTime(a.timestamp);
    return timeDifference || a.id.localeCompare(b.id);
  });
}

export interface PipelineVisit {
  id: string;
  status: ComplaintStatus;
  timestamp: string | null;
}

export function buildPipelineVisits(complaint: Complaint): PipelineVisit[] {
  const visits: PipelineVisit[] = [{
    id: `created-${complaint.id}`,
    status: "submitted",
    timestamp: complaint.created_at ?? null,
  }];
  const histories = [...(complaint.status_histories ?? complaint.timeline ?? [])].sort(
    (a, b) => validTime(a.created_at) - validTime(b.created_at) || a.id - b.id,
  );
  histories.forEach((history) => {
    const target = history.to_status as ComplaintStatus | undefined;
    if (!target || !(target in STATUS_TRANSITIONS) || history.from_status === target) return;
    visits.push({ id: `history-${history.id}`, status: target, timestamp: history.created_at ?? null });
  });
  const lastVisit = visits.at(-1);
  if (lastVisit?.status !== complaint.status) {
    visits.push({ id: `current-${complaint.id}`, status: complaint.status, timestamp: complaint.updated_at ?? null });
  }
  return visits;
}
