"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import type { Complaint } from "@/types/api";
import { Modal } from "@/components/modal";
import { useLocale } from "@/lib/locale-context";
import {
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/form-field";

function errorMessage(
  err: unknown,
  fallback: string,
  t: (p: string) => string,
): string {
  if (err instanceof ApiError) {
    if (err.status === 403) return t("complaintDetail.forbidden");
    if (err.status === 404) return t("complaintDetail.complaintNotFound");
    return err.message || fallback;
  }
  return fallback;
}

export function ComplaintInformationRequest({
  complaint,
  onRequestInfo,
}: {
  complaint: Complaint;
  onRequestInfo: (message: string) => Promise<void>;
}) {
  const { t } = useLocale();
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  const activeRequest = complaint.active_information_request;
  const hasPendingRequest =
    !!activeRequest && activeRequest.status === "pending";
  // Backend only allows waiting_citizen as a transition from in_progress.
  const canRequest = complaint.status === "in_progress" && !hasPendingRequest;

  async function onSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!requestMessage.trim() || sendingRequest) return;
    setSendingRequest(true);
    setRequestError(null);
    setRequestSuccess(null);
    try {
      await onRequestInfo(requestMessage.trim());
      setRequestOpen(false);
      setRequestMessage("");
      setRequestSuccess(t("complaintDetail.infoRequestSentToCitizen"));
    } catch (err) {
      setRequestError(
        errorMessage(err, t("complaintDetail.infoRequestFailed"), t),
      );
    } finally {
      setSendingRequest(false);
    }
  }

  function formatTime(date?: string | null) {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  }

  const isResponded = !!activeRequest && activeRequest.status === "responded";

  return (
    <div className="mt-4 rounded-lg border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">
            {t("complaintDetail.infoRequestHeading")}
          </h2>
          <p className="text-xs text-muted">
            {t("complaintDetail.commentsSubtitle")}
          </p>
        </div>
        {canRequest && (
          <button
            type="button"
            onClick={() => {
              setRequestError(null);
              setRequestMessage("");
              setRequestOpen(true);
            }}
            className={primaryButtonClass}
          >
            {t("complaintDetail.requestInfoBtn")}
          </button>
        )}
      </div>

      {requestSuccess && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          ✓ {requestSuccess}
        </div>
      )}

      {activeRequest ? (
        <div className="mt-4 rounded-lg border border-line bg-paper p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {t("complaintDetail.infoRequestMessage")}
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                isResponded
                  ? "bg-teal/10 text-teal"
                  : "bg-purple-500/10 text-purple-500"
              }`}
            >
              {isResponded
                ? t("complaintDetail.infoRequestResponded")
                : t("complaintDetail.infoRequestPending")}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink">
            {activeRequest.message}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
            {activeRequest.requested_by && (
              <span>
                {t("common.by")}: {activeRequest.requested_by.name}
              </span>
            )}
            {activeRequest.requested_at && (
              <span>{formatTime(activeRequest.requested_at)}</span>
            )}
          </div>

          {isResponded ? (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-xs font-medium text-green-700">
                {t("complaintDetail.infoRequestResponse")}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-ink">
                {activeRequest.response_message || "—"}
              </p>
              {activeRequest.responded_at && (
                <p className="mt-1 text-[11px] text-muted">
                  {formatTime(activeRequest.responded_at)}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted">
              {t("complaintDetail.infoRequestPending")}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">
          {canRequest
            ? t("complaintDetail.noComments")
            : t("complaintDetail.infoRequestOnlyFromInProgress")}
        </p>
      )}

      {requestOpen && (
        <Modal
          title={t("complaintDetail.requestInfoModalTitle")}
          onClose={() => setRequestOpen(false)}
        >
          <p className="mb-3 text-sm text-muted">
            {t("complaintDetail.requestInfoDescription")}
          </p>
          <form onSubmit={onSubmitRequest} className="space-y-3">
            <textarea
              className={inputClass}
              rows={4}
              autoFocus
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              disabled={sendingRequest}
              placeholder={t("complaintDetail.infoRequestPlaceholder")}
            />
            {requestError && (
              <p className="text-sm text-brick">{requestError}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRequestOpen(false)}
                disabled={sendingRequest}
                className={secondaryButtonClass}
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={sendingRequest || !requestMessage.trim()}
                className={primaryButtonClass}
              >
                {sendingRequest
                  ? t("common.saving")
                  : t("complaintDetail.sendRequest")}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
