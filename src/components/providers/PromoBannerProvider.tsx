"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isPromoBannerDismissed, PROMO_BANNER_CHANGE_EVENT } from "@/lib/promo-banner";

const PROMO_HIDE_THRESHOLD = 32;

interface PromoBannerState {
  /** Banner is on screen: not dismissed, and the page has not scrolled it away. */
  bannerVisible: boolean;
  /**
   * True once the dismissed flag has been read from localStorage. Until then the banner must not
   * mount: the server always assumes "open", and hiding it again during hydration ran an exit
   * animation before the lazy motion features loaded, leaving a dismissed banner stuck on screen.
   */
  ready: boolean;
  dismiss: () => void;
}

const PromoBannerContext = createContext<PromoBannerState>({
  bannerVisible: true,
  ready: false,
  dismiss: () => {},
});

export function PromoBannerProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showPromo = !pathname.startsWith("/admin");
  const [dismissed, setDismissed] = useState(false);
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const nextDismissed = !showPromo || isPromoBannerDismissed();
      setDismissed(nextDismissed);
      setReady(true);
      // Hysteresis so a padding change cannot immediately show the banner again.
      setScrolledPastThreshold((wasPast) => {
        if (!showPromo) return true;
        const y = window.scrollY;
        if (wasPast) return y > 8;
        return y > PROMO_HIDE_THRESHOLD;
      });
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener(PROMO_BANNER_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener(PROMO_BANNER_CHANGE_EVENT, sync);
    };
  }, [showPromo]);

  const bannerVisible = showPromo && !dismissed && !scrolledPastThreshold;

  useLayoutEffect(() => {
    // Before the flag is read, keep what the server / inline head script decided.
    if (!ready) return;
    document.documentElement.dataset.promo = bannerVisible ? "open" : "closed";
  }, [bannerVisible, ready]);

  return (
    <PromoBannerContext.Provider
      value={{
        bannerVisible,
        ready,
        dismiss: () => setDismissed(true),
      }}
    >
      {children}
    </PromoBannerContext.Provider>
  );
}

export function usePromoBanner() {
  return useContext(PromoBannerContext);
}
