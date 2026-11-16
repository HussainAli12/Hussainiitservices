import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/admin/ui/button";

export function AdminStatus({
  code,
  title,
  description,
  detail,
  action,
}: {
  code: string;
  title: string;
  description: string;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground tabular-nums">{code}</p>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {detail && <p className="font-mono text-xs text-muted-foreground">{detail}</p>}
      <div className="mt-4 flex gap-2">
        {action}
        <Button variant="outline" asChild>
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
