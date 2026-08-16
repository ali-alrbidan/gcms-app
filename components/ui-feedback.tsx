"use client";

import { Component, type ReactNode } from "react";
import { useLocale } from "@/lib/locale-context";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-line/50 ${className ?? ""}`}
    />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="border-b border-line bg-paper px-4 py-3">
        <Skeleton className="h-3 w-28" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-6 border-b border-line px-4 py-3.5 last:border-0"
        >
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/5" />
          <Skeleton className="h-3 w-1/6" />
          <Skeleton className="h-3 w-1/6" />
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-line bg-surface p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-7 w-12" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-6">
        <TableSkeleton rows={5} />
      </div>
    </div>
  );
}

export function LoginSkeleton() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-surface p-6 shadow-sm">
        <Skeleton className="mx-auto h-4 w-16" />
        <Skeleton className="mx-auto h-6 w-44" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </main>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const { t } = useLocale();
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-lg border border-brick/30 bg-brick/5 p-6"
    >
      <p className="text-sm text-brick">
        {message || t("common.somethingWrong")}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-paper"
        >
          {t("common.retry")}
        </button>
      )}
    </div>
  );
}

interface AsyncErrorBoundaryProps {
  fallback: (retry: () => void, error: unknown) => ReactNode;
  children: ReactNode;
}

interface AsyncErrorBoundaryState {
  error: unknown;
}

export class AsyncErrorBoundary extends Component<
  AsyncErrorBoundaryProps,
  AsyncErrorBoundaryState
> {
  state: AsyncErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): AsyncErrorBoundaryState {
    return { error };
  }

  retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback(this.retry, this.state.error);
    }
    return this.props.children;
  }
}
