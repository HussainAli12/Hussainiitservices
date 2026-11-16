import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { DeferredAnalytics } from "@/components/seo/DeferredAnalytics";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { ScrollOnNavigate } from "@/components/providers/ScrollOnNavigate";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { detectMotionBudgetScript } from "@/lib/motion-budget";
import { consentDefaultsScript } from "@/lib/analytics";
import { promoBannerInitScript } from "@/lib/promo-banner";
import {
  absoluteUrl,
  defaultDescription,
  defaultOgImage,
  geoLocations,
  officesJsonLd,
  organizationJsonLd,
  rssFeedPath,
  siteName,
  siteUrl,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F2744",
  viewportFit: "cover",
};

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Web, SEO, Ads & AI Voice Agents — Dubai & Ujjain`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  other: {
    "geo.region": geoLocations[0].region,
    "geo.placename": geoLocations[0].placename,
    "geo.position": geoLocations[0].position,
    ICBM: geoLocations[0].icbm,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}${rssFeedPath}`,
    },
  },
  openGraph: {
    title: `${siteName} | Web, SEO, Ads & AI Voice Agents — Dubai & Ujjain`,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    locale: "en_GB",
    type: "website",
    images: [{ ...defaultOgImage, url: absoluteUrl(defaultOgImage.url) }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Web, SEO, Ads & AI Voice Agents — Dubai & Ujjain`,
    description: defaultDescription,
    images: [absoluteUrl(defaultOgImage.url)],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  appleWebApp: {
    title: siteName,
    statusBarStyle: "default",
    capable: true,
  },
  manifest: "/manifest.webmanifest",
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} data-promo="open" suppressHydrationWarning>
      <head>
        <Script
          id="motion-budget-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: detectMotionBudgetScript() }}
        />
        <Script
          id="promo-banner-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: promoBannerInitScript() }}
        />
        <Script
          id="ga-consent-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: consentDefaultsScript() }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <MotionProvider>
          <DeferredAnalytics />
          <CookieConsent />
          <ScrollOnNavigate />
          <JsonLd data={[organizationJsonLd(), websiteJsonLd(), ...officesJsonLd()]} />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
