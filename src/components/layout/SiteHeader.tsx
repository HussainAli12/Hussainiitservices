"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { TopOfferBanner } from "@/components/layout/TopOfferBanner";
import { usePromoBanner } from "@/components/providers/PromoBannerProvider";

export function SiteHeader() {
  const pathname = usePathname();
  const showPromo = !pathname.startsWith("/admin");
  const { bannerVisible, ready, dismiss } = usePromoBanner();

  return (
    <>
      {showPromo ? <TopOfferBanner visible={ready && bannerVisible} onDismiss={dismiss} /> : null}
      <Navbar promoOffset={bannerVisible} />
    </>
  );
}
