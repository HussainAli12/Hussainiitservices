import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

interface OgCardOptions {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer?: string;
}

/**
 * Branded 1200×630 social card (navy, matches the site palette).
 * Used by every opengraph-image / twitter-image route so cards look consistent.
 */
export function renderOgCard({ eyebrow, title, subtitle, footer }: OgCardOptions) {
  const titleSize = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #0F2744 0%, #13305a 55%, #1D4ED8 140%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: "radial-gradient(ellipse 60% 70% at 85% 10%, rgba(29,78,216,0.45), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.3)",
                fontSize: 22,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {eyebrow}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
            <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
            {subtitle ? (
              <div style={{ marginTop: 22, fontSize: 28, lineHeight: 1.35, color: "rgba(255,255,255,0.75)" }}>{subtitle}</div>
            ) : null}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>Hussaini IT Services</div>
              <div style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                {footer ?? "Ujjain · Dubai — hussainiitservices.com"}
              </div>
            </div>
            <div style={{ display: "flex", width: 120, height: 8, borderRadius: 8, background: "#3B82F6" }} />
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}

/** Full-bleed image (e.g. a designed blog cover) resized to 1200×630 */
export function renderOgImageOnly(url: string) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0F2744" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (Satori) only supports <img> */}
        <img src={url} alt="" width={1200} height={630} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    ),
    ogSize,
  );
}
