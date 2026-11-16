"use client";

import { AdminBlogPanel } from "@/components/admin/AdminBlogPanel";
import { AdminError, AdminPageHeader, TableSkeleton } from "@/components/admin/shell/AdminPageHeader";
import { useAdminDelete } from "@/components/admin/use-admin-delete";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import type { DbBlog } from "@/lib/types/database";

export default function AdminBlogPage() {
  const resource = useAdminResource<DbBlog[]>("/api/admin/blogs");
  const deletion = useAdminDelete((id) => resource.mutate((items) => items?.filter((item) => item.id !== id) ?? null));

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Articles, covers, and search metadata."
        onRefresh={resource.reload}
        refreshing={resource.refreshing}
      />
      <AdminError message={resource.error} />
      {resource.loading ? (
        <TableSkeleton />
      ) : (
        <AdminBlogPanel
          blogs={resource.data ?? []}
          onSaved={resource.reload}
          onRequestDelete={(item) =>
            deletion.request({ endpoint: "/api/admin/blogs", id: item.id, label: item.title, title: "Delete post?" })
          }
        />
      )}
      {deletion.dialog}
    </>
  );
}
