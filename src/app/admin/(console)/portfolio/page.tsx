"use client";

import { AdminPortfolioPanel } from "@/components/admin/AdminPortfolioPanel";
import { AdminError, AdminPageHeader, TableSkeleton } from "@/components/admin/shell/AdminPageHeader";
import { useAdminDelete } from "@/components/admin/use-admin-delete";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import type { DbPortfolio } from "@/lib/types/database";

export default function AdminPortfolioPage() {
  const resource = useAdminResource<DbPortfolio[]>("/api/admin/portfolio");
  const deletion = useAdminDelete((id) => resource.mutate((items) => items?.filter((item) => item.id !== id) ?? null));

  return (
    <>
      <AdminPageHeader
        title="Portfolio"
        description="Client projects, logos, and case studies."
        onRefresh={resource.reload}
        refreshing={resource.refreshing}
      />
      <AdminError message={resource.error} />
      {resource.loading ? (
        <TableSkeleton />
      ) : (
        <AdminPortfolioPanel
          portfolio={resource.data ?? []}
          onSaved={resource.reload}
          onRequestDelete={(item) =>
            deletion.request({ endpoint: "/api/admin/portfolio", id: item.id, label: item.title, title: "Delete project?" })
          }
        />
      )}
      {deletion.dialog}
    </>
  );
}
