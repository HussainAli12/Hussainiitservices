import { AdminShell } from "@/components/admin/shell/AdminShell";

// Kept free of cookies()/headers() so every admin route stays static and <Link> can prefetch
// it fully — navigation then only waits on data, which the client cache already holds.
export default function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
