import { useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

/** false during SSR and hydration, true afterwards — without setState inside an effect */
export function useHydrated() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}
