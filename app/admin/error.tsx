"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui-feedback";

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-6">
      <ErrorState message={error.message} onRetry={unstable_retry} />
    </div>
  );
}
