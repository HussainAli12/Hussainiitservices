"use client";

import Script from "next/script";
import { GA_MEASUREMENT_ID, markAnalyticsReady } from "@/lib/analytics";

let configured = false;

function handleGtagReady() {
  if (!configured) {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        // gtag.js reads Arguments objects, not rest-parameter arrays
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

    window.gtag("js", new Date());
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: false,
    });
    configured = true;
  }

  markAnalyticsReady();
}

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
      onReady={handleGtagReady}
    />
  );
}
