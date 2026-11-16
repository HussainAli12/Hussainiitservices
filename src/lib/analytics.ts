import { COOKIE_CONSENT_STORAGE_KEY, hasAnalyticsConsent } from "@/lib/cookie-consent";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-5EM02YC0Q8";

export type AnalyticsEventName =
  | "page_view"
  | "generate_lead"
  | "form_start"
  | "form_submit"
  | "contact_click"
  | "cta_click"
  | "outbound_click"
  | "file_download"
  | "cookie_consent";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

type GtagConsentState = "granted" | "denied";

interface GtagConsentParams {
  ad_storage?: GtagConsentState;
  ad_user_data?: GtagConsentState;
  ad_personalization?: GtagConsentState;
  analytics_storage?: GtagConsentState;
  functionality_storage?: GtagConsentState;
  personalization_storage?: GtagConsentState;
  security_storage?: GtagConsentState;
  wait_for_update?: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const FILE_EXTENSIONS = /\.(pdf|docx?|xlsx?|pptx?|zip|csv)$/i;
let lastPagePath: string | null = null;
let analyticsReady = false;
const pendingEvents: Array<[AnalyticsEventName, Record<string, string | number | boolean>]> = [];

/** Consent Mode v2 defaults — must run before gtag.js so no cookies are written early. */
export function consentDefaultsScript(): string {
  return `(function(){window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});try{var r=localStorage.getItem('${COOKIE_CONSENT_STORAGE_KEY}');if(!r)return;var c=JSON.parse(r);if(c&&c.choice==='all'){gtag('consent','update',{analytics_storage:'granted'})}}catch(e){}})();`;
}

export function isLocalAnalyticsHost(hostname?: string) {
  const host = hostname ?? (typeof window === "undefined" ? "" : window.location.hostname);
  return host === "localhost" || host === "127.0.0.1";
}

export function shouldLoadAnalytics() {
  if (!GA_MEASUREMENT_ID) return false;
  if (typeof window === "undefined") return true;
  if (isLocalAnalyticsHost() && process.env.NEXT_PUBLIC_GA_DEBUG !== "true") {
    return false;
  }
  return true;
}

export function markAnalyticsReady() {
  analyticsReady = true;
  if (!canQueue()) return;

  for (const [name, params] of pendingEvents) {
    window.gtag?.("event", name, params);
  }
  pendingEvents.length = 0;
}

export function applyConsentToGtag(granted: boolean) {
  if (typeof window === "undefined") return;
  ensureGtagStub();

  const state: GtagConsentState = granted ? "granted" : "denied";
  const params: GtagConsentParams = {
    analytics_storage: state,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };

  window.gtag?.("consent", "update", params);
}

export function getContentGroup(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/portfolio")) return "portfolio";
  if (pathname.startsWith("/contact")) return "contact";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/careers")) return "careers";
  if (pathname.startsWith("/testimonials")) return "testimonials";
  if (pathname.startsWith("/best-it-services")) return "locations";
  if (pathname.startsWith("/privacy-policy") || pathname.startsWith("/terms-and-conditions")) {
    return "legal";
  }
  return "other";
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}) {
  if (!canQueue()) return;

  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean>;

  if (!analyticsReady || typeof window.gtag !== "function") {
    pendingEvents.push([name, cleaned]);
    return;
  }

  window.gtag("event", name, cleaned);
}

export function trackPageView(path: string) {
  if (!canQueue()) return;
  if (lastPagePath === path) return;
  lastPagePath = path;

  trackEvent("page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    content_group: getContentGroup(path.split("?")[0] ?? path),
  });
}

export function trackFormStart(formId = "website_contact", formName = "Contact") {
  trackEvent("form_start", {
    form_id: formId,
    form_name: formName,
    form_destination: "/api/contact",
  });
}

export function trackFormSubmit(formId = "website_contact", formName = "Contact") {
  trackEvent("form_submit", {
    form_id: formId,
    form_name: formName,
    form_destination: "/api/contact",
  });
}

export function trackGenerateLead(params: AnalyticsParams = {}) {
  trackEvent("generate_lead", {
    form_id: "website_contact",
    form_name: "Contact",
    lead_source: "contact_form",
    ...params,
  });
}

export function trackCookieConsent(choice: "all" | "essential") {
  if (choice !== "all") return;
  trackEvent("cookie_consent", { consent_choice: choice });
}

export function trackLinkClick(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return;
  }

  const linkText = getLinkText(anchor);
  const linkUrl = url.href;

  if (url.protocol === "tel:") {
    trackEvent("contact_click", {
      method: "phone",
      link_url: linkUrl,
      link_text: linkText,
    });
    return;
  }

  if (url.protocol === "mailto:") {
    trackEvent("contact_click", {
      method: "email",
      link_url: linkUrl,
      link_text: linkText,
    });
    return;
  }

  if (isWhatsAppUrl(url)) {
    trackEvent("contact_click", {
      method: "whatsapp",
      link_url: linkUrl,
      link_text: linkText,
    });
    return;
  }

  if (FILE_EXTENSIONS.test(url.pathname)) {
    trackEvent("file_download", {
      file_name: url.pathname.split("/").pop(),
      file_extension: url.pathname.split(".").pop(),
      link_url: linkUrl,
      link_text: linkText,
    });
    return;
  }

  if (url.origin !== window.location.origin) {
    trackEvent("outbound_click", {
      link_url: linkUrl,
      link_domain: url.hostname,
      link_text: linkText,
      outbound: true,
    });
    return;
  }

  if (url.pathname === "/contact" || url.pathname.startsWith("/contact/")) {
    trackEvent("cta_click", {
      destination: url.pathname,
      link_text: linkText,
      link_url: linkUrl,
    });
  }
}

function canQueue() {
  if (typeof window === "undefined") return false;
  if (!shouldLoadAnalytics()) return false;
  if (!hasAnalyticsConsent()) return false;
  ensureGtagStub();
  return true;
}

function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") return;
  window.gtag = function gtag() {
    // gtag.js reads Arguments objects, not rest-parameter arrays
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
}

function getLinkText(anchor: HTMLAnchorElement) {
  const labelled = anchor.getAttribute("aria-label") || anchor.textContent || "";
  return labelled.replace(/\s+/g, " ").trim().slice(0, 80);
}

function isWhatsAppUrl(url: URL) {
  return url.hostname === "wa.me" || url.hostname.endsWith(".whatsapp.com") || url.hostname === "whatsapp.com";
}

