"use client";

import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/**
 * Components render with the tiny `m` component; the animation features download after
 * hydration. `strict` makes any stray full-size `motion.*` import fail loudly in dev.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
