"use client";

import { AdminMessagesPanel } from "@/components/admin/AdminMessagesPanel";
import { AdminError, AdminPageHeader, TableSkeleton } from "@/components/admin/shell/AdminPageHeader";
import { useAdminDelete } from "@/components/admin/use-admin-delete";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import type { DbContactSubmission } from "@/lib/types/database";

export default function AdminMessagesPage() {
  const resource = useAdminResource<DbContactSubmission[]>("/api/admin/contacts");
  const deletion = useAdminDelete((id) => resource.mutate((items) => items?.filter((item) => item.id !== id) ?? null));

  return (
    <>
      <AdminPageHeader
        title="Inbox"
        description="Enquiries sent from the website contact form."
        onRefresh={resource.reload}
        refreshing={resource.refreshing}
      />
      <AdminError message={resource.error} />
      {resource.loading ? (
        <TableSkeleton />
      ) : (
        <AdminMessagesPanel
          items={resource.data ?? []}
          onRequestDelete={(item) =>
            deletion.request({ endpoint: "/api/admin/contacts", id: item.id, label: item.name, title: "Delete message?" })
          }
        />
      )}
      {deletion.dialog}
    </>
  );
}
