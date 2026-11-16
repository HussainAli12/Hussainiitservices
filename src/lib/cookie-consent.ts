export type CookieConsentChoice = "all" | "essential";

export interface CookieConsentRecord {
  choice: CookieConsentChoice;
  updatedAt: string;
}

export const COOKIE_CONSENT_STORAGE_KEY = "hits-cookie-consent";
export const COOKIE_CONSENT_CHANGE_EVENT = "hits-cookie-consent-change";

export function readCookieConsent(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed.choice !== "all" && parsed.choice !== "essential") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent()?.choice === "all";
}

export function saveCookieConsent(choice: CookieConsentChoice) {
  if (typeof window === "undefined") return;

  const record: CookieConsentRecord = {
    choice,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
  window.dispatchEvent(
    new CustomEvent<CookieConsentChoice>(COOKIE_CONSENT_CHANGE_EVENT, { detail: choice }),
  );
}

export function clearCookieConsent() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent<CookieConsentChoice | null>(COOKIE_CONSENT_CHANGE_EVENT, { detail: null }),
  );
}
