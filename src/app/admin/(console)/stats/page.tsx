"use client";

import { AdminStatsPanel } from "@/components/admin/AdminStatsPanel";
import { AdminError, AdminPageHeader, PageSkeleton } from "@/components/admin/shell/AdminPageHeader";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import type { DbSiteStats } from "@/lib/types/database";

export default function AdminStatsPage() {
  const resource = useAdminResource<DbSiteStats>("/api/admin/stats");

  return (
    <>
      <AdminPageHeader title="Site stats" description="Numbers shown in the homepage counters." />
      <AdminError message={resource.error} />
      {resource.loading ? (
        <PageSkeleton />
      ) : resource.data ? (
        <AdminStatsPanel stats={resource.data} onSaved={resource.reload} />
      ) : null}
    </>
  );
}
