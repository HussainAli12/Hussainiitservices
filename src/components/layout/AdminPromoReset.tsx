"use client";

import { useLayoutEffect } from "react";

/** Admin has no promo banner, so public page offsets must not stay applied. */
export function AdminPromoReset() {
  useLayoutEffect(() => {
    document.documentElement.dataset.promo = "closed";
  }, []);

  return null;
}
