"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import {
  applyMotionBudgetToDom,
  cacheMotionBudget,
  detectMotionBudget,
  downgradeMotionBudget,
  MOTION_DOWNGRADE_EVENT,
  type MotionBudget,
} from "@/lib/motion-budget";
import { useFirstInteraction } from "@/lib/use-first-interaction";

const MotionBudgetContext = createContext<MotionBudget>("lite");

function getClientBudget(): MotionBudget {
  return detectMotionBudget();
}

function getServerBudget(): MotionBudget {
  return "lite";
}

function subscribe(onStoreChange: () => void) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reducedData = window.matchMedia("(prefers-reduced-data: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const narrowViewport = window.matchMedia("(max-width: 768px)");

  window.addEventListener(MOTION_DOWNGRADE_EVENT, onStoreChange);
  reducedMotion.addEventListener("change", onStoreChange);
  reducedData.addEventListener("change", onStoreChange);
  coarsePointer.addEventListener("change", onStoreChange);
  narrowViewport.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener(MOTION_DOWNGRADE_EVENT, onStoreChange);
    reducedMotion.removeEventListener("change", onStoreChange);
    reducedData.removeEventListener("change", onStoreChange);
    coarsePointer.removeEventListener("change", onStoreChange);
    narrowViewport.removeEventListener("change", onStoreChange);
  };
}

export function MotionBudgetProvider({ children }: { children: ReactNode }) {
  const budget = useSyncExternalStore(subscribe, getClientBudget, getServerBudget);
  const interacted = useFirstInteraction();

  useEffect(() => {
    cacheMotionBudget(budget);
    applyMotionBudgetToDom(budget);
  }, [budget]);

  useFrameRateGuard(budget === "full" && interacted);

  return (
    <MotionBudgetContext.Provider value={budget}>{children}</MotionBudgetContext.Provider>
  );
}

/**
 * Once heavy effects are running, sample ~2s of frames. If the device averages under ~35fps it
 * can't afford WebGL + canvas + smooth scroll, so drop to the "lite" budget for the session.
 */
function useFrameRateGuard(active: boolean) {
  useEffect(() => {
    if (!active) return;
    let rafId = 0;
    let frames = 0;
    let start = 0;
    const startTimer = window.setTimeout(() => {
      const tick = (time: number) => {
        if (!start) start = time;
        frames += 1;
        const elapsed = time - start;
        if (elapsed >= 2000) {
          if (document.visibilityState === "visible" && frames / (elapsed / 1000) < 35) downgradeMotionBudget();
          return;
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }, 1200); // let the effects warm up (shader compile) before measuring
    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(rafId);
    };
  }, [active]);
}

export function useMotionBudget() {
  return useContext(MotionBudgetContext);
}
