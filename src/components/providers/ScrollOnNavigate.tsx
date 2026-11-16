"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { resetScrollForRoute } from "@/lib/scroll/scroll-to-top";

export function ScrollOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    resetScrollForRoute();
    const frame = requestAnimationFrame(resetScrollForRoute);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}