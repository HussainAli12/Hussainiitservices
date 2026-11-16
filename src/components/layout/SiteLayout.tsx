"use client";

import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { MotionBudgetProvider } from "@/components/providers/MotionBudgetProvider";
import { PromoBannerProvider } from "@/components/providers/PromoBannerProvider";
import { PremiumBackground } from "@/components/ui/PremiumBackground";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ChromeProvider } from "@/components/providers/ChromeProvider";
import type { SiteChrome } from "@/i18n/chrome";

interface SiteLayoutProps {
  children: React.ReactNode;
  /** Translated header/footer for /ar and /hi pages */
  chrome?: SiteChrome;
}

export function SiteLayout({ children, chrome }: SiteLayoutProps) {
  return (
    <ChromeProvider chrome={chrome}>
    <MotionBudgetProvider>
      <PromoBannerProvider>
      <SmoothScroll>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <ScrollProgress />
        <PremiumBackground />
        <SiteHeader />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
        <FloatingActions />
      </SmoothScroll>
      </PromoBannerProvider>
    </MotionBudgetProvider>
    </ChromeProvider>
  );
}
