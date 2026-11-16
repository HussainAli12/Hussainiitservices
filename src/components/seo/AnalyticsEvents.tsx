"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackLinkClick, trackPageView } from "@/lib/analytics";
import { hasAnalyticsConsent } from "@/lib/cookie-consent";

export function AnalyticsEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    const search = searchParams.toString();
    const path = search ? `${pathname}?${search}` : pathname;
    const frame = window.requestAnimationFrame(() => trackPageView(path));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      trackLinkClick(anchor);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
