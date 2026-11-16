import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function scrollToTopSmooth() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0);
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

export function resetScrollForRoute() {
  const id = window.location.hash.replace(/^#/, "");
  if (id) {
    const target = document.getElementById(id);
    if (target) {
      if (lenisInstance) {
        lenisInstance.scrollTo(target, { immediate: true });
      } else {
        target.scrollIntoView({ block: "start", behavior: "auto" });
      }
      return;
    }
  }

  scrollToTop();
}
