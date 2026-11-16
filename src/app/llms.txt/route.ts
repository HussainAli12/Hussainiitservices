import { buildLlmTxt } from "@/lib/seo/content";

/** Lists key blog posts from Supabase; refreshed hourly and on admin save. */
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildLlmTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
