"use client";

import { m } from "framer-motion";
import { companyInfo } from "@/lib/constants";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canUseHeavyEffects } from "@/lib/motion-budget";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

export function WhatsAppFloat() {
  const budget = useMotionBudget();
  const heavyEffects = canUseHeavyEffects(budget);

  return (
    <m.a
      href={companyInfo.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp ${companyInfo.whatsapp.display}`}
      initial={{ opacity: 0, scale: 0.6, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={heavyEffects ? { scale: 1.08 } : undefined}
      whileTap={heavyEffects ? { scale: 0.95 } : undefined}
      className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_28px_rgba(29,78,216,0.45)] transition-colors duration-300 hover:bg-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {heavyEffects ? (
        <m.span
          className="absolute inset-0 rounded-full bg-accent"
          animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          aria-hidden
        />
      ) : null}
      <WhatsAppIcon className="relative z-10 h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-navy px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:inline-block">
        Chat on WhatsApp
      </span>
    </m.a>
  );
}
