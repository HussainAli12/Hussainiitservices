import { AdminStatus } from "@/components/admin/shell/AdminStatus";

export default function AdminNotFound() {
  return (
    <AdminStatus
      code="404"
      title="Page not found"
      description="That route does not exist in the admin workspace."
    />
  );
}
