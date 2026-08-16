"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import Image from "next/image";
import { employeeComplaintsApi, ApiError } from "@/lib/api";
import type { Complaint, ComplaintStatus, Attachment } from "@/types/api";
import { StatusBadge, useStatusLabel } from "@/components/status-badge";
import { inputClass, primaryButtonClass } from "@/components/form-field";
import { useLocale } from "@/lib/locale-context";
import { ComplaintInformationRequest } from "@/components/complaint-information-request";
import { Skeleton } from "@/components/ui-feedback";

function isImageAttachment(attachment: Attachment): boolean {
  const mime = attachment.mime_type?.toLowerCase() ?? "";
  if (mime.startsWith("image/")) return true;
  const name = (
    attachment.file_name ||
    attachment.original_name ||
    ""
  ).toLowerCase();
  return /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/.test(name);
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusDotColor(status: string): string {
  const colors: Record<string, string> = {
    submitted: "bg-ink",
    under_review: "bg-amber",
    assigned: "bg-ink-2",
    in_progress: "bg-brass-dark",
    waiting_citizen: "bg-muted",
    escalated: "bg-brick",
    resolved: "bg-teal",
    closed: "bg-muted",
    rejected: "bg-brick",
  };
  return colors[status] ?? "bg-muted";
}

function Avatar({ name }: { name?: string | null }) {
  const initials = (name || "?")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
      aria-hidden
    >
      {initials}
    </span>
  );
}

function HeroStatusBadge({ status }: { status: ComplaintStatus | string }) {
  const label = useStatusLabel()(status);
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-white">
      <span className={`h-2.5 w-2.5 rounded-full ${statusDotColor(status)}`} />
      {label}
    </span>
  );
}

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
          {icon && <span aria-hidden>{icon}</span>}
          {title}
        </h2>
        {subtitle && (
          <span className="text-xs font-medium text-muted">{subtitle}</span>
        )}
      </header>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function InfoTile({
  icon,
  label,
  value,
  sub,
  dotColor,
  valueClassName,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  dotColor?: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-1.5 text-muted">
        <span className="text-sm" aria-hidden>
          {icon}
        </span>
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p
        className={`mt-2 flex items-center gap-1.5 text-sm font-semibold text-ink ${valueClassName ?? ""}`}
      >
        {dotColor && (
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`} />
        )}
        <span className="truncate">{value}</span>
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}

function ComplaintDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <Skeleton className="h-4 w-40" />

      {/* Hero */}
      <div className="mt-4 overflow-hidden rounded-2xl bg-ink/10">
        <div className="p-6">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-3 h-8 w-3/4 max-w-md" />
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>
      </div>

      {/* Key info tiles */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-line bg-surface p-4"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </div>

      {/* Location + Classification */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-4 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-2.5 w-full rounded-full" />
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
      </div>

      {/* Attachments */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
        <Skeleton className="h-4 w-28" />
        <div className="mt-3 flex gap-3">
          <Skeleton className="h-24 w-28" />
          <Skeleton className="h-24 w-28" />
          <Skeleton className="h-24 w-28" />
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
        <Skeleton className="h-4 w-36" />
        <div className="mt-4 space-y-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="mt-1 h-4 w-4 rounded-full" />
              <div className="flex-1 rounded-xl border border-line bg-paper p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update status */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-3 w-2/3" />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EmployeeComplaintDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const { t } = useLocale();
  const statusLabel = useStatusLabel();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newStatus, setNewStatus] = useState<ComplaintStatus | "">("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState("");

  useEffect(() => {
    if (!previewUrl) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPreviewUrl(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewUrl]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { complaint } = await employeeComplaintsApi.show(id);
      setComplaint(complaint);
      setNewStatus("");
      setNote("");
      setUpdateSuccess(false);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : t("complaintDetail.couldNotLoad"),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onUpdateStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!newStatus) return;
    setSaving(true);
    setSaveError(null);
    setUpdateSuccess(false);
    try {
      await employeeComplaintsApi.updateStatus(id, {
        status: newStatus,
        note: note || undefined,
      });
      setNote("");
      setUpdateSuccess(true);
      await load();
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.errors?.status?.[0]
            ? err.errors.status[0]
            : err.message || t("complaintDetail.statusUpdateFailed")
          : t("complaintDetail.statusUpdateFailed"),
      );
    } finally {
      setSaving(false);
    }
  }

  async function onRequestInfo(message: string) {
    await employeeComplaintsApi.updateStatus(id, {
      status: "waiting_citizen",
      note: message,
    });
    await load();
  }

  // Helper function to format date
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  };

  // Helper function to format duration
  const formatDuration = (minutes: number | null | undefined) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Get valid status transitions for EMPLOYEE (backend-enforced).
  // Backend UpdateComplaintStatusRequest only accepts:
  //   under_review | in_progress | waiting_citizen | resolved | escalated
  // So `assigned`, `rejected` and `closed` are never offered (they 422).
  // `in_progress` from `under_review` triggers the backend's self-assign
  // acquisition for unassigned complaints.
  const getValidStatusTransitions = (
    currentStatus: ComplaintStatus,
  ): ComplaintStatus[] => {
    const transitions: Record<ComplaintStatus, ComplaintStatus[]> = {
      submitted: ["under_review"],
      under_review: ["in_progress", "escalated"],
      assigned: ["in_progress", "escalated"],
      in_progress: ["waiting_citizen", "resolved", "escalated"],
      waiting_citizen: ["in_progress", "resolved"],
      resolved: [],
      closed: [],
      rejected: [],
      escalated: ["in_progress", "resolved"],
    };
    return transitions[currentStatus] || [];
  };

  // Check if status is terminal (no further transitions allowed)
  const isTerminalStatus = (status: ComplaintStatus): boolean => {
    return status === "closed" || status === "rejected";
  };

  // Check if note is required for status transition
  // (backend: note is required only when status === waiting_citizen)
  const isNoteRequired = (toStatus: ComplaintStatus): boolean => {
    return toStatus === "waiting_citizen";
  };

  if (loading) {
    return <ComplaintDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-brick/20 bg-brick/5 px-6 py-12 text-center">
        <span className="text-3xl" aria-hidden>
          ⚠️
        </span>
        <p className="max-w-md text-sm text-brick">{error}</p>
        <button
          type="button"
          onClick={load}
          className="rounded-md border border-brick/30 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Link
        href="/employee"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
      >
        ← {t("common.backToList")}
      </Link>

      {/* Hero header */}
      <div className="overflow-hidden rounded-2xl bg-ink text-white shadow-sm">
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                {t("complaintDetail.complaintNumber")} #
                {complaint.complaint_number || complaint.id}
              </p>
              <h1 className="mt-1 text-2xl font-semibold leading-tight sm:text-3xl">
                {complaint.title}
              </h1>
            </div>
            <HeroStatusBadge status={complaint.status} />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
            <span>
              📅 {t("complaintDetail.createdAt")}: {formatDate(complaint.created_at)}
            </span>
            <span>
              🏷️ {t("complaintDetail.source")}: {complaint.source || "—"}
            </span>
            {complaint.client_ref && (
              <span>
                🔖 {t("complaintDetail.clientRef")}: {complaint.client_ref}
              </span>
            )}
            <span>
              🔄 {t("complaintDetail.updatedAt")}: {formatDate(complaint.updated_at)}
            </span>
          </div>
        </div>
        <div className={`h-1 ${statusDotColor(complaint.status)}`} aria-hidden />
      </div>

      {/* Key info */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InfoTile
          icon="🏢"
          label={t("complaintDetail.department")}
          value={complaint.department?.name ?? "—"}
          sub={complaint.department?.code || undefined}
        />
        <InfoTile
          icon="🗂️"
          label={t("complaintDetail.category")}
          value={complaint.category?.name ?? "—"}
          sub={complaint.category?.code || undefined}
        />
        <InfoTile
          icon="🚨"
          label={t("complaintDetail.priority")}
          value={complaint.priority?.name ?? "—"}
          sub={
            complaint.priority?.level
              ? `${t("complaintDetail.level")}: ${complaint.priority.level}`
              : undefined
          }
          dotColor="bg-amber"
        />
        <InfoTile
          icon="⏱️"
          label={t("complaintDetail.slaDue")}
          value={complaint.sla_due_at ? formatDate(complaint.sla_due_at) : "—"}
          sub={
            complaint.is_sla_breached
              ? `⚠️ ${t("complaintDetail.slaBreached")}`
              : complaint.resolved_at
                ? `${t("complaintDetail.resolvedAt")}: ${formatDate(complaint.resolved_at)}`
                : undefined
          }
          valueClassName={complaint.is_sla_breached ? "text-brick" : undefined}
        />
      </div>

      {/* Description */}
      <div className="mt-4">
        <SectionCard icon="📝" title={t("complaintDetail.description")}>
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink/90">
            {complaint.description}
          </p>
        </SectionCard>
      </div>

      {/* Location + Classification */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard icon="📍" title={t("complaintDetail.location")}>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted">{t("complaintDetail.address")}</p>
              <p className="text-sm font-medium text-ink">
                {complaint.address || "—"}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted">
                  {t("complaintDetail.coordinates")}
                </p>
                <p className="font-mono text-sm text-ink">
                  {complaint.latitude && complaint.longitude
                    ? `${complaint.latitude}, ${complaint.longitude}`
                    : "—"}
                </p>
              </div>
              {complaint.latitude && complaint.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary transition hover:underline"
                >
                  📍 {t("complaintDetail.viewOnMap")}
                </a>
              )}
            </div>
            {complaint.location && (
              <p className="rounded-lg bg-paper px-3 py-2 font-mono text-xs text-muted">
                {t("complaintDetail.fullLocation")}:{" "}
                {JSON.stringify(complaint.location)}
              </p>
            )}
          </div>
        </SectionCard>

        {complaint.classification_confidence && (
          <SectionCard
            icon="🤖"
            title={t("complaintDetail.classification")}
            subtitle={`${Math.round(
              Number(complaint.classification_confidence),
            )}%`}
          >
            <div className="flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-teal transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Number(complaint.classification_confidence),
                    )}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-ink">
                {Math.round(Number(complaint.classification_confidence))}%
              </span>
            </div>
            {complaint.classification && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span>
                  {t("complaintDetail.classificationMethod")}:{" "}
                  {complaint.classification.method || "—"}
                </span>
                <span>
                  {t("complaintDetail.autoAssigned")}:{" "}
                  {complaint.classification.auto_assigned ? "✅" : "—"}
                </span>
              </div>
            )}
          </SectionCard>
        )}
      </div>

      {/* Attachments */}
      {complaint.attachments && complaint.attachments.length > 0 && (
        <div className="mt-4">
          <SectionCard
            icon="📎"
            title={t("complaintDetail.attachments")}
            subtitle={String(complaint.attachments.length)}
          >
            <div className="flex flex-wrap gap-3">
              {complaint.attachments.map((attachment, index) =>
                attachment.url && isImageAttachment(attachment) ? (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setPreviewName(
                        attachment.original_name ||
                          attachment.file_name ||
                          `${t("complaintDetail.attachment")} ${index + 1}`,
                      );
                      setPreviewUrl(attachment.url as string);
                    }}
                    className="group w-28 overflow-hidden rounded-xl border border-line bg-paper transition-colors hover:border-primary"
                    title={t("complaintDetail.viewAttachment")}
                  >
                    <div className="relative h-24 w-full">
                      <Image
                        src={attachment.url as string}
                        alt={
                          attachment.original_name ||
                          attachment.file_name ||
                          `${t("complaintDetail.attachment")} ${index + 1}`
                        }
                        fill
                        sizes="112px"
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        unoptimized={
                          (attachment.url as string).toLowerCase().endsWith(
                            ".svg",
                          ) ||
                          attachment.mime_type?.toLowerCase() ===
                            "image/svg+xml"
                        }
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/40 text-xl text-white opacity-0 transition group-hover:opacity-100">
                        🔍
                      </span>
                    </div>
                    <p
                      className="truncate px-2 py-1.5 text-xs text-muted"
                      title={
                        attachment.original_name ||
                        attachment.file_name ||
                        `${t("complaintDetail.attachment")} ${index + 1}`
                      }
                    >
                      {attachment.original_name ||
                        attachment.file_name ||
                        `${t("complaintDetail.attachment")} ${index + 1}`}
                    </p>
                  </button>
                ) : (
                  <a
                    key={index}
                    href={attachment.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
                    title={
                      formatFileSize(attachment.file_size)
                        ? `${attachment.original_name || attachment.file_name || ""} (${formatFileSize(attachment.file_size)})`
                        : undefined
                    }
                  >
                    <span aria-hidden>📎</span>
                    {attachment.original_name ||
                      attachment.file_name ||
                      `${t("complaintDetail.attachment")} ${index + 1}`}
                  </a>
                ),
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Citizen Info */}
      {complaint.citizen && (
        <div className="mt-4">
          <SectionCard icon="👤" title={t("complaintDetail.citizen")}>
            <div className="flex flex-wrap items-center gap-3">
              <Avatar name={complaint.citizen.name} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {complaint.citizen.name}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {complaint.citizen.email && (
                    <a
                      href={`mailto:${complaint.citizen.email}`}
                      className="text-primary transition hover:underline"
                    >
                      ✉️ {complaint.citizen.email}
                    </a>
                  )}
                  {complaint.citizen.phone && (
                    <a
                      href={`tel:${complaint.citizen.phone}`}
                      className="text-primary transition hover:underline"
                    >
                      📞 {complaint.citizen.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Timeline / Status History */}
      {complaint.timeline && complaint.timeline.length > 0 && (
        <div className="mt-4">
          <SectionCard icon="🕓" title={t("complaintDetail.timeline")}>
            <ol className="relative space-y-5">
              <span
                className="absolute start-[7px] bottom-2 top-2 w-0.5 bg-line"
                aria-hidden
              />
              {complaint.timeline.map((event) => (
                <li key={event.id} className="relative flex gap-4">
                  <span
                    className={`relative z-10 mt-1.5 h-4 w-4 shrink-0 rounded-full ${statusDotColor(
                      event.to_status || "submitted",
                    )} ring-4 ring-paper`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1 rounded-xl border border-line bg-paper p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-ink">
                          {event.to_status
                            ? statusLabel(event.to_status)
                            : statusLabel("submitted")}
                        </p>
                        {event.from_status && (
                          <span className="text-xs text-muted">
                            ← {statusLabel(event.from_status)}
                          </span>
                        )}
                      </div>
                      <time className="text-xs text-muted">
                        {formatDate(event.created_at)}
                      </time>
                    </div>
                    {event.note && (
                      <p className="mt-2 whitespace-pre-wrap rounded-lg bg-surface px-3 py-2 text-sm text-ink/90">
                        💬 {event.note}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                      {event.changed_by && (
                        <span>
                          👤 {t("common.by")}: {event.changed_by}
                        </span>
                      )}
                      {event.duration_minutes ? (
                        <span>
                          ⏱️ {t("complaintDetail.duration")}:{" "}
                          {formatDuration(event.duration_minutes)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>
        </div>
      )}

      {/* Assignments History */}
      {complaint.assignments && complaint.assignments.length > 0 && (
        <div className="mt-4">
          <SectionCard icon="🤝" title={t("complaintDetail.assignmentsHistory")}>
            <ul className="space-y-3">
              {complaint.assignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex gap-3 rounded-xl border border-line bg-paper p-3"
                >
                  <Avatar name={assignment.assigned_to?.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">
                        {assignment.assigned_to?.name || "—"}
                      </p>
                      <time className="text-xs text-muted">
                        {formatDate(assignment.assigned_at)}
                      </time>
                    </div>
                    <p className="text-xs text-muted">
                      {t("complaintDetail.assignedBy")}:{" "}
                      {assignment.assigned_by?.name}
                      {assignment.assigned_by?.role
                        ? ` (${assignment.assigned_by.role})`
                        : ""}
                      {assignment.department
                        ? ` · ${assignment.department.name}`
                        : ""}
                    </p>
                    {assignment.note && (
                      <p className="mt-1 text-sm text-muted">
                        💬 {assignment.note}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      {/* Information Request */}
      <ComplaintInformationRequest
        complaint={complaint}
        onRequestInfo={onRequestInfo}
      />

      {/* Update Status Form - with backend-enforced transitions */}
      {!isTerminalStatus(complaint.status) && (
        <div className="mt-4">
          <SectionCard icon="⚡" title={t("complaintDetail.updateStatusHeading")}>
            <p className="text-sm text-muted">
              {t("complaintDetail.updateStatusSubtitle")}
            </p>
            <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-xl bg-paper px-3 py-2 text-sm">
              <span className="text-muted">
                {t("complaintDetail.currentStatus")}:
              </span>
              <StatusBadge status={complaint.status} />
            </div>

            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">
              {t("complaintDetail.chooseNewStatus")}
            </p>
            {getValidStatusTransitions(complaint.status).length === 0 ? (
              <p className="mt-2 text-sm text-muted">
                {t("complaintDetail.noStatusChangesAvailable")}
              </p>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {getValidStatusTransitions(complaint.status).map((s) => {
                  const selected = newStatus === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setNewStatus(s);
                        setSaveError(null);
                        setUpdateSuccess(false);
                      }}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                        selected
                          ? "border-primary bg-primary/10 text-ink shadow-sm"
                          : "border-line bg-paper text-ink hover:border-primary/50"
                      }`}
                    >
                      <span
                        className={`h-3 w-3 shrink-0 rounded-full ${statusDotColor(s)}`}
                        aria-hidden
                      />
                      <span className="truncate font-medium">{statusLabel(s)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {updateSuccess && (
              <div className="mt-4 rounded-xl border border-teal/30 bg-teal/10 px-4 py-3 text-sm font-medium text-teal">
                ✓ {t("complaintDetail.statusUpdated")}
              </div>
            )}

            {newStatus && (
              <form
                onSubmit={onUpdateStatus}
                className="mt-4 space-y-3 border-t border-line pt-4"
              >
                <div>
                  <label className="flex flex-wrap items-center gap-1 text-sm font-medium text-ink">
                    {t("common.note")}
                    {isNoteRequired(newStatus as ComplaintStatus) && (
                      <span className="text-brick" title={t("complaintDetail.noteRequiredHint")}>
                        *
                      </span>
                    )}
                    <span className="text-xs font-normal text-muted">
                      ({t("common.optional")})
                    </span>
                  </label>
                  <textarea
                    className={`${inputClass} mt-1`}
                    rows={3}
                    placeholder={t("complaintDetail.notePlaceholder")}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={saving}
                    required={isNoteRequired(newStatus as ComplaintStatus)}
                  />
                  {isNoteRequired(newStatus as ComplaintStatus) && (
                    <p className="mt-1 text-xs text-muted">
                      {t("complaintDetail.noteRequiredHint")}
                    </p>
                  )}
                </div>
                {saveError && (
                  <p className="rounded-lg border border-brick/20 bg-brick/10 px-3 py-2 text-sm text-brick">
                    ⚠️ {saveError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={
                    saving ||
                    (isNoteRequired(newStatus as ComplaintStatus) &&
                      !note.trim())
                  }
                  className={`${primaryButtonClass} w-full sm:w-auto`}
                >
                  {saving
                    ? t("common.saving")
                    : t("complaintDetail.updateStatusHeading")}
                </button>
              </form>
            )}
          </SectionCard>
        </div>
      )}

      {/* Terminal status message */}
      {isTerminalStatus(complaint.status) && (
        <div className="mt-4 rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              {complaint.status === "closed" ? "✅" : "🚫"}
            </span>
            <div>
              <p className="text-base font-semibold text-ink">
                {complaint.status === "closed"
                  ? t("complaintDetail.complaintClosed")
                  : t("complaintDetail.complaintRejected")}
              </p>
              <p className="text-sm text-muted">
                {t("complaintDetail.noFurtherActions")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image preview lightbox */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/95 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewUrl(null);
          }}
        >
          <button
            type="button"
            onClick={() => setPreviewUrl(null)}
            aria-label={t("common.close")}
            className="absolute end-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
          >
            ✕
          </button>
          <p className="mb-3 max-w-[80vw] truncate text-sm text-white/90">
            {previewName}
          </p>
          <div className="relative h-[80vh] w-[80vw] overflow-hidden rounded-lg">
            <Image
              src={previewUrl}
              alt={previewName}
              fill
              sizes="80vw"
              className="object-contain"
              unoptimized={previewUrl.toLowerCase().endsWith(".svg")}
            />
          </div>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 text-sm text-white/80 underline transition-colors hover:text-white"
          >
            {t("complaintDetail.openOriginal")} ↗
          </a>
        </div>
      )}
    </div>
  );
}
