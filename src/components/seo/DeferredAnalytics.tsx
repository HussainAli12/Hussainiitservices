"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/seo/MicrosoftClarity";
import { AnalyticsEvents } from "@/components/seo/AnalyticsEvents";
import { applyConsentToGtag, shouldLoadAnalytics } from "@/lib/analytics";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  hasAnalyticsConsent,
  type CookieConsentChoice,
} from "@/lib/cookie-consent";

function AnalyticsRuntime() {
  return (
    <>
      <GoogleAnalytics />
      <MicrosoftClarity />
      <Suspense fallback={null}>
        <AnalyticsEvents />
      </Suspense>
    </>
  );
}

/** Load analytics only after the visitor accepts optional cookies. */
export function DeferredAnalytics() {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      const granted = hasAnalyticsConsent();
      setConsented(granted);
      applyConsentToGtag(granted);
    };

    syncConsent();

    const onConsentChange = (event: Event) => {
      const detail = (event as CustomEvent<CookieConsentChoice | null>).detail;
      const granted = detail === "all";
      setConsented(granted);
      applyConsentToGtag(granted);
    };

    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onConsentChange);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onConsentChange);
  }, []);

  if (pathname.startsWith("/admin")) return null;
  if (!consented || !shouldLoadAnalytics()) return null;

  return <AnalyticsRuntime />;
}
