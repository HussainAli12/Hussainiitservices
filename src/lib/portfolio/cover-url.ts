import type { DbPortfolio } from "@/lib/types/database";

export function getPortfolioCoverUrl(
  project: Pick<DbPortfolio, "image_url" | "logo_url" | "cover_type">,
): string | null {
  const hasLogo = Boolean(project.logo_url);
  const hasScreenshot = Boolean(project.image_url);

  if (project.cover_type === "logo" && hasLogo) {
    return project.logo_url;
  }

  if (hasScreenshot) {
    return project.image_url;
  }

  if (hasLogo) {
    return project.logo_url;
  }

  return null;
}
