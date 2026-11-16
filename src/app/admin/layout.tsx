import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AdminPromoReset } from "@/components/layout/AdminPromoReset";
import { Toaster } from "@/components/admin/ui/sonner";
import { TooltipProvider } from "@/components/admin/ui/tooltip";

/** Loaded only on /admin routes; the public site keeps Poppins. */
const geist = Geist({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Admin | Hussaini IT Services",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Exposed on :root so portalled dialogs and menus use the admin font too. */}
      <style>{`:root{--admin-font:${geist.style.fontFamily}}`}</style>
      <AdminPromoReset />
      <TooltipProvider delayDuration={200}>
        <div data-admin-root className="min-h-svh bg-background text-foreground antialiased">
          {children}
        </div>
      </TooltipProvider>
      <Toaster position="bottom-right" />
    </>
  );
}
