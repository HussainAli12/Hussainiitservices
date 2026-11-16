import { getBlogDisplayDate, stripMarkdown } from "@/lib/blog/format";
import { fetchBlogs } from "@/lib/data/fetch";
import { resolveBlogMetaDescription } from "@/lib/seo/blog";
import { siteName, siteUrl } from "@/lib/seo";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const revalidate = 120;

export async function GET() {
  const posts = await fetchBlogs();
  const feedUrl = `${siteUrl}/feed.xml`;

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const description = escapeXml(resolveBlogMetaDescription(post) || stripMarkdown(post.excerpt || post.content).slice(0, 220));
      const author = escapeXml(post.author || siteName);
      const enclosure = post.cover_image_url
        ? `\n      <enclosure url="${escapeXml(post.cover_image_url)}" type="image/jpeg" length="0" />`
        : "";
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(getBlogDisplayDate(post)).toUTCString()}</pubDate>
      <author>${author}</author>
      <description>${description}</description>${enclosure}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} Blog</title>
    <link>${siteUrl}/blog</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Articles on web development, SEO, and digital marketing from ${escapeXml(siteName)}.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
