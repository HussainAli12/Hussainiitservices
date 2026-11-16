import type { DbBlog } from "@/lib/types/database";
import { isLivePost } from "@/lib/seo/site-urls";

/**
 * Preferred posts first (in the given order), topped up with the most recent live posts.
 * Slugs that are unpublished or missing are skipped silently.
 */
export function pickRelatedPosts(posts: DbBlog[], preferredSlugs: string[], limit = 3) {
  const live = posts.filter((post) => isLivePost(post));
  const bySlug = new Map(live.map((post) => [post.slug, post]));
  const picked = preferredSlugs
    .map((slug) => bySlug.get(slug))
    .filter((post): post is DbBlog => Boolean(post));

  for (const post of live) {
    if (picked.length >= limit) break;
    if (!picked.includes(post)) picked.push(post);
  }

  return picked.slice(0, limit);
}
