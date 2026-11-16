"use client";

import { AdminTestimonialsPanel } from "@/components/admin/AdminTestimonialsPanel";
import { AdminError, AdminPageHeader, TableSkeleton } from "@/components/admin/shell/AdminPageHeader";
import { useAdminDelete } from "@/components/admin/use-admin-delete";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import type { DbTestimonial } from "@/lib/types/database";

export default function AdminTestimonialsPage() {
  const resource = useAdminResource<DbTestimonial[]>("/api/admin/testimonials");
  const deletion = useAdminDelete((id) => resource.mutate((items) => items?.filter((item) => item.id !== id) ?? null));

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Client quotes and logos shown across the site."
        onRefresh={resource.reload}
        refreshing={resource.refreshing}
      />
      <AdminError message={resource.error} />
      {resource.loading ? (
        <TableSkeleton />
      ) : (
        <AdminTestimonialsPanel
          items={resource.data ?? []}
          onSaved={resource.reload}
          onRequestDelete={(item) =>
            deletion.request({
              endpoint: "/api/admin/testimonials",
              id: item.id,
              label: item.company || item.name,
              title: "Delete testimonial?",
            })
          }
        />
      )}
      {deletion.dialog}
    </>
  );
}
