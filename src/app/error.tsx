"use client";

import Link from "next/link";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  StatusScreen,
  statusPrimaryClassName,
  statusSecondaryClassName,
} from "@/components/sections/status/StatusScreen";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SiteLayout>
      <StatusScreen
        code="500"
        title="Something broke."
        description="We hit a problem loading this page. Try again, or go home and continue from there."
        detail={error.digest ? `Reference ${error.digest}` : undefined}
        actions={
          <>
            <button type="button" onClick={reset} className={statusPrimaryClassName()}>
              Try again
            </button>
            <Link href="/" className={statusSecondaryClassName()}>
              Go home
            </Link>
          </>
        }
      />
    </SiteLayout>
  );
}
