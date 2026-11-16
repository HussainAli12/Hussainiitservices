export const PROMO_BANNER_DISMISSED_KEY = "hits-promo-banner-dismissed";
export const PROMO_BANNER_CHANGE_EVENT = "hits-promo-banner-change";

export function isPromoBannerDismissed(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return localStorage.getItem(PROMO_BANNER_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissPromoBanner() {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PROMO_BANNER_DISMISSED_KEY, "1");
    window.dispatchEvent(new CustomEvent(PROMO_BANNER_CHANGE_EVENT));
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Inline <head> script: the server cannot read localStorage, so it always renders the page
 * with the promo offsets applied. Close them before first paint for visitors who dismissed it.
 */
export function promoBannerInitScript(): string {
  return `try{if(localStorage.getItem(${JSON.stringify(PROMO_BANNER_DISMISSED_KEY)})==="1"&&!location.pathname.startsWith("/admin"))document.documentElement.dataset.promo="closed"}catch(e){}`;
}
