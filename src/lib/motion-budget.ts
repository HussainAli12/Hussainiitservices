export type MotionBudget = "full" | "lite" | "static";

export const MOTION_BUDGET_STORAGE_KEY = "hits-motion-budget";

/** Conservative detection for pre-hydration inline script (matches detectMotionBudget logic). */
export function detectMotionBudgetScript(): string {
  return `(function(){try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var d=navigator.connection&&navigator.connection.saveData;var rd=window.matchMedia('(prefers-reduced-data: reduce)').matches;if(r||d||rd){document.documentElement.dataset.motion='static';return;}var phone=window.matchMedia('(pointer: coarse)').matches&&window.matchMedia('(max-width: 768px)').matches;var cores=navigator.hardwareConcurrency||8;var mem=navigator.deviceMemory;var dg=false;try{dg=sessionStorage.getItem('hits-motion-downgraded')==='1'}catch(e){}if(phone||cores<=4||(mem!==undefined&&mem<=4)||dg){document.documentElement.dataset.motion='lite';return;}document.documentElement.dataset.motion='full';}catch(e){document.documentElement.dataset.motion='lite';}})();`;
}

/** Set when frame sampling shows the device can't keep up — sticks for the session */
const DOWNGRADE_KEY = "hits-motion-downgraded";
export const MOTION_DOWNGRADE_EVENT = "hits:motion-downgrade";

export function isMotionDowngraded() {
  try {
    return sessionStorage.getItem(DOWNGRADE_KEY) === "1";
  } catch {
    return false;
  }
}

export function downgradeMotionBudget() {
  try {
    sessionStorage.setItem(DOWNGRADE_KEY, "1");
  } catch {
    // sessionStorage may be unavailable
  }
  window.dispatchEvent(new Event(MOTION_DOWNGRADE_EVENT));
}

export function detectMotionBudget(): MotionBudget {
  if (typeof window === "undefined") {
    return "lite";
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "static";
  }

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData || window.matchMedia("(prefers-reduced-data: reduce)").matches) {
    return "static";
  }

  const isPhone =
    window.matchMedia("(pointer: coarse)").matches &&
    window.matchMedia("(max-width: 768px)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  if (isPhone || cores <= 4 || (memory !== undefined && memory <= 4) || isMotionDowngraded()) {
    return "lite";
  }

  return "full";
}

export function readCachedMotionBudget(): MotionBudget | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = sessionStorage.getItem(MOTION_BUDGET_STORAGE_KEY);
    if (cached === "full" || cached === "lite" || cached === "static") {
      return cached;
    }
  } catch {
    // sessionStorage may be unavailable
  }
  return null;
}

export function cacheMotionBudget(budget: MotionBudget) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MOTION_BUDGET_STORAGE_KEY, budget);
  } catch {
    // ignore
  }
}

export function readDomMotionBudget(): MotionBudget | null {
  if (typeof document === "undefined") return null;
  const value = document.documentElement.dataset.motion;
  if (value === "full" || value === "lite" || value === "static") {
    return value;
  }
  return null;
}

export function applyMotionBudgetToDom(budget: MotionBudget) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.motion = budget;
}

export function isFullBudget(budget: MotionBudget) {
  return budget === "full";
}

export function canAnimate(budget: MotionBudget) {
  return budget !== "static";
}

export function canUseHeavyEffects(budget: MotionBudget) {
  return budget === "full";
}
