"use client";

import { createContext, useContext, type ReactNode } from "react";
import { enChrome, type SiteChrome } from "@/i18n/chrome";

const ChromeContext = createContext<SiteChrome>(enChrome);

/** Header/footer labels and links for the current language (English unless a page passes one) */
export function ChromeProvider({ chrome, children }: { chrome?: SiteChrome; children: ReactNode }) {
  return <ChromeContext.Provider value={chrome ?? enChrome}>{children}</ChromeContext.Provider>;
}

export function useChrome() {
  return useContext(ChromeContext);
}
