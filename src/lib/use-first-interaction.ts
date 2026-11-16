import { useSyncExternalStore } from "react";

/**
 * true once the visitor has interacted (pointer, scroll, touch, key).
 * Decorative effects (WebGL threads, animated grid) wait for this so they never compete with
 * page load, hydration or the first paint — the content itself is unaffected.
 */
let interacted = false;
const listeners = new Set<() => void>();
const EVENTS = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"] as const;

function markInteracted() {
  if (interacted) return;
  interacted = true;
  for (const event of EVENTS) window.removeEventListener(event, markInteracted);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  if (!interacted && listeners.size === 0) {
    for (const event of EVENTS) window.addEventListener(event, markInteracted, { passive: true });
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFirstInteraction() {
  return useSyncExternalStore(subscribe, () => interacted, () => false);
}
