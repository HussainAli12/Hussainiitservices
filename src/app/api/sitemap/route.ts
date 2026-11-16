import { buildSitemapXml } from "@/lib/seo/sitemap-xml";

/** Re-read Supabase at most hourly; admin saves also call revalidatePath("/sitemap.xml"). */
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildSitemapXml(), {
    headers: {
      // text/xml (not a feed-specific type) so browsers apply /sitemap.css.
      // The body is still a sitemap urlset; crawlers do not use the stylesheet.
      "Content-Type": "text/xml; charset=utf-8",
    },
  });
}
