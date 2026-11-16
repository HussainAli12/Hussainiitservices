import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The floating dev badge sat on top of the admin sidebar; errors still show without it.
  devIndicators: false,
  experimental: {
    // Tailwind output is ~20 KB: inlining it removes two render-blocking requests so the page
    // paints before the JS bundles evaluate (big win for mobile FCP/LCP).
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "hussainiitservices.com" }],
        destination: "https://www.hussainiitservices.com/:path*",
        permanent: true,
      },
      {
        source: "/best-it-services/japan",
        destination: "/best-it-services",
        permanent: true,
      },
      {
        source: "/best-it-services/singapore",
        destination: "/best-it-services",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Next reserves app/sitemap.ts for /sitemap.xml and will not serve a route
      // from that path. The public URL stays /sitemap.xml.
      { source: "/sitemap.xml", destination: "/api/sitemap" },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
