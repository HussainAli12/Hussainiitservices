import type { DbBlog } from "@/lib/types/database";

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

/** Meta description for older posts without a stored value */
export function resolveBlogMetaDescription(post: DbBlog): string {
  const stored = post.meta_description?.trim();
  if (stored) return stored;

  const excerpt = post.excerpt?.trim();
  if (excerpt) return excerpt.length > 160 ? `${excerpt.slice(0, 157)}...` : excerpt;

  const plain = post.content
    .replace(/[#>*`[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > 160 ? `${plain.slice(0, 157)}...` : plain;
}

/** SEO keywords with sensible fallback for legacy posts */
export function resolveBlogKeywords(post: DbBlog): string[] {
  const stored = post.meta_keywords?.filter(Boolean) ?? [];
  if (stored.length > 0) return stored;

  const titleTerms = post.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word))
    .slice(0, 5);

  return [...new Set(["IT blog", "Hussaini IT Services", post.title, ...titleTerms])];
}

/** Cover image alt text for accessibility and image SEO */
export function resolveBlogCoverAlt(post: Pick<DbBlog, "cover_image_alt" | "title">): string {
  return post.cover_image_alt?.trim() || post.title;
}

export function normalizeBlogSeoFields(body: Record<string, unknown>) {
  return {
    meta_keywords: parseKeywordsInput(body.meta_keywords),
    meta_description: body.meta_description ? String(body.meta_description).trim() : null,
    cover_image_alt: body.cover_image_alt ? String(body.cover_image_alt).trim() : null,
  };
}
