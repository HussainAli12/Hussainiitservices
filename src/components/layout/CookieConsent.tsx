"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";
import { applyConsentToGtag, trackCookieConsent } from "@/lib/analytics";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  readCookieConsent,
  saveCookieConsent,
  type CookieConsentChoice,
} from "@/lib/cookie-consent";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;
const UNDECIDED = "undecided" as const;
const SSR_HIDDEN = "ssr-hidden" as const;

/** Primitive snapshot so useSyncExternalStore can compare with Object.is */
type ConsentSnapshot = CookieConsentChoice | typeof UNDECIDED | typeof SSR_HIDDEN;

function subscribe(onStoreChange: () => void) {
  window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onStoreChange);
}

function getClientConsentSnapshot(): ConsentSnapshot {
  return readCookieConsent()?.choice ?? UNDECIDED;
}

function getServerConsentSnapshot(): ConsentSnapshot {
  return SSR_HIDDEN;
}

export function CookieConsent() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const consentSnapshot = useSyncExternalStore(
    subscribe,
    getClientConsentSnapshot,
    getServerConsentSnapshot,
  );

  const visible =
    consentSnapshot === UNDECIDED && !pathname.startsWith("/admin");

  const handleChoice = (choice: CookieConsentChoice) => {
    saveCookieConsent(choice);
    applyConsentToGtag(choice === "all");
    trackCookieConsent(choice);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
          aria-live="polite"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease }}
          className="fixed inset-x-0 bottom-0 z-[90]"
        >
          <div
            className={cn(
              "premium-card flex w-full flex-col gap-4 border-t border-border/80 bg-white/95 px-4 py-4 shadow-[0_-8px_32px_rgba(15,39,68,0.08)] backdrop-blur-md sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-5 lg:px-8",
            )}
          >
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <div className="icon-box mt-0.5 h-10 w-10 shrink-0 sm:mt-0">
                <Cookie size={18} aria-hidden />
              </div>
              <div className="min-w-0">
                <p
                  id="cookie-consent-title"
                  className="font-display text-sm font-semibold text-foreground sm:text-base"
                >
                  We use cookies
                </p>
                <p
                  id="cookie-consent-description"
                  className="mt-1 text-xs leading-relaxed text-muted sm:text-sm"
                >
                  We use essential cookies to run the site and optional analytics cookies to understand
                  how visitors use our pages. You can accept all cookies or continue with essential
                  cookies only. Read our{" "}
                  <Link href="/privacy-policy" className="font-medium text-accent hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => handleChoice("essential")}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:text-accent"
              >
                Essential only
              </button>
              <button
                type="button"
                onClick={() => handleChoice("all")}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
              >
                Accept all
              </button>
            </div>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
