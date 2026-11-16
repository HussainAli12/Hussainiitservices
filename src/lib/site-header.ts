/** Promo strip height — keep TopOfferBanner shell and Navbar offset in sync */
export const promoBannerShellClass = "min-h-14 sm:h-10";

/** Gap between promo strip and navbar — matches navbar top padding (pt-3 / pt-4) */
export const promoBannerNavGapMobile = "0.75rem";
export const promoBannerNavGapDesktop = "1rem";

/** Navbar `top` when the promo strip is visible (banner height + gap) */
export const promoBannerNavTopClass =
  "top-[calc(3.5rem+0.75rem)] sm:top-[calc(2.5rem+1rem)]";

/** Navbar top padding when the promo strip is visible */
export const promoBannerNavPaddingClass = "pt-3 sm:pt-4";
