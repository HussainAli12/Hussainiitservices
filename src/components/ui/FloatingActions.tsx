"use client";

import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col-reverse items-center gap-3 sm:bottom-6 sm:right-6">
      <WhatsAppFloat />
      <ScrollToTopButton />
    </div>
  );
}
