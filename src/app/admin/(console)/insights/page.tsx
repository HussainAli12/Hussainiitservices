"use client";

import { AdminInsightsPanel } from "@/components/admin/AdminInsightsPanel";
import { AdminError, AdminPageHeader, PageSkeleton } from "@/components/admin/shell/AdminPageHeader";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import type { InsightsReport } from "@/lib/google/types";

export default function AdminInsightsPage() {
  // Google data changes slowly and the server caches it for 10 minutes; match that here.
  const resource = useAdminResource<InsightsReport>("/api/admin/insights", { maxAgeMs: 10 * 60 * 1000 });

  return (
    <>
      <AdminPageHeader
        title="Insights"
        description="Google Analytics and Search Console for the last 28 days."
        onRefresh={resource.refresh}
        refreshing={resource.refreshing}
      />
      <AdminError message={resource.error} />
      {resource.loading ? <PageSkeleton /> : resource.data ? <AdminInsightsPanel report={resource.data} /> : null}
    </>
  );
}
