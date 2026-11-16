"use client";

import { AdminStatus } from "@/components/admin/shell/AdminStatus";
import { Button } from "@/components/admin/ui/button";

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AdminStatus
      code="500"
      title="Something went wrong"
      description="This screen failed to load. Try again, or return to the dashboard."
      detail={error.digest ? `Reference ${error.digest}` : undefined}
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
