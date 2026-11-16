import Image from "next/image";
import type { DbPortfolio, PortfolioCoverType } from "@/lib/types/database";

interface PortfolioCoverProps {
  title: string;
  logoUrl?: string | null;
  imageUrl?: string | null;
  coverType?: PortfolioCoverType;
  className?: string;
  /** Set on project detail hero for LCP */
  priority?: boolean;
}

function resolveCover(
  logoUrl?: string | null,
  imageUrl?: string | null,
  coverType: PortfolioCoverType = "screenshot"
) {
  const hasLogo = Boolean(logoUrl);
  const hasScreenshot = Boolean(imageUrl);

  if (coverType === "logo" && hasLogo) {
    return { src: logoUrl!, mode: "logo" as const };
  }

  if (hasScreenshot) {
    return { src: imageUrl!, mode: "screenshot" as const };
  }

  if (hasLogo) {
    return { src: logoUrl!, mode: "logo" as const };
  }

  return null;
}

export function PortfolioCover({
  title,
  logoUrl,
  imageUrl,
  coverType = "screenshot",
  className = "h-40",
  priority = false,
}: PortfolioCoverProps) {
  const cover = resolveCover(logoUrl, imageUrl, coverType);

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 border-b border-border ${className}`}
    >
      {cover ? (
        <Image
          src={cover.src}
          alt={title}
          fill
          priority={priority}
          className={cover.mode === "logo" ? "object-contain p-6" : "object-cover object-top"}
          unoptimized={cover.src.endsWith(".svg")}
        />
      ) : (
        <span className="text-4xl font-display font-bold text-accent/30">
          {title.charAt(0)}
        </span>
      )}
    </div>
  );
}

export function getPortfolioCoverProps(project: DbPortfolio) {
  return {
    title: project.title,
    logoUrl: project.logo_url,
    imageUrl: project.image_url,
    coverType: project.cover_type ?? "screenshot",
  };
}
