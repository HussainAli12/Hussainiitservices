import type { DbPortfolio } from "@/lib/types/database";

const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "from",
  "into",
  "that",
  "the",
  "this",
  "with",
  "your",
]);

/** Parse comma-separated or string[] keywords from admin input */
export function parseKeywordsInput(value: unknown): string[] {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
  }

  if (typeof value === "string") {
    return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
  }

  return [];
}

/** Meta description for projects without a stored value */
export function resolvePortfolioMetaDescription(project: DbPortfolio): string {
  const stored = project.meta_description?.trim();
  if (stored) return stored;

  const description = project.description?.trim();
  if (description) return description.length > 160 ? `${description.slice(0, 157)}...` : description;

  const plain = project.content
    .replace(/[#>*`[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > 160 ? `${plain.slice(0, 157)}...` : plain || project.title;
}

/** SEO keywords with sensible fallback for legacy projects */
export function resolvePortfolioKeywords(project: DbPortfolio): string[] {
  const stored = project.meta_keywords?.filter(Boolean) ?? [];
  if (stored.length > 0) return stored;

  const titleTerms = project.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word))
    .slice(0, 5);

  const stack = project.tech_stack?.slice(0, 5) ?? [];

  return [
    ...new Set([
      "web development portfolio",
      "Hussaini IT Services",
      project.category,
      project.title,
      ...stack,
      ...titleTerms,
    ]),
  ];
}

/** Cover image alt text for accessibility and image SEO */
export function resolvePortfolioCoverAlt(
  project: Pick<DbPortfolio, "cover_image_alt" | "title">,
): string {
  return project.cover_image_alt?.trim() || project.title;
}

export function normalizePortfolioSeoFields(body: Record<string, unknown>) {
  return {
    meta_keywords: parseKeywordsInput(body.meta_keywords),
    meta_description: body.meta_description ? String(body.meta_description).trim() : null,
    cover_image_alt: body.cover_image_alt ? String(body.cover_image_alt).trim() : null,
  };
}
