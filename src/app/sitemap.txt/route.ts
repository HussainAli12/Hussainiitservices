import { buildSitemapTxt } from "@/lib/seo/content";

/** Re-read Supabase at most hourly; admin saves also call revalidatePath("/sitemap.txt"). */
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildSitemapTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
