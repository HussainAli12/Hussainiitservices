import { getSiteUrlEntries, siteUrlFor, type SiteUrlEntry } from "@/lib/seo/site-urls";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Sitemap protocol XML, same fields and element order as Next's metadata sitemap,
 * plus a CSS stylesheet instruction browsers use when a person opens the file.
 * Crawlers ignore that instruction and read the urlset as usual.
 */
export async function buildSitemapXml() {
  const entries = await getSiteUrlEntries();
  const hasImages = entries.some((entry) => entry.images?.length);
  const hasAlternates = entries.some((entry) => entry.languages && Object.keys(entry.languages).length > 0);

  let content = '<?xml version="1.0" encoding="UTF-8"?>\n';
  content += '<?xml-stylesheet type="text/css" href="/sitemap.css"?>\n';
  content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  if (hasImages) {
    content += ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  }
  if (hasAlternates) {
    content += ' xmlns:xhtml="http://www.w3.org/1999/xhtml"';
  }
  content += ">\n";

  for (const entry of entries) {
    content += urlEntryXml(entry);
  }

  content += "</urlset>\n";
  return content;
}

function urlEntryXml(entry: SiteUrlEntry) {
  let content = "<url>\n";
  content += `<loc>${escapeXml(siteUrlFor(entry.path))}</loc>\n`;

  if (entry.languages) {
    for (const language in entry.languages) {
      content += `<xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(entry.languages[language])}" />\n`;
    }
  }

  if (entry.images?.length) {
    for (const image of entry.images) {
      content += `<image:image>\n<image:loc>${escapeXml(image)}</image:loc>\n</image:image>\n`;
    }
  }

  content += `<lastmod>${entry.lastModified.toISOString()}</lastmod>\n`;
  content += `<changefreq>${entry.changeFrequency}</changefreq>\n`;
  content += `<priority>${entry.priority}</priority>\n`;
  content += "</url>\n";
  return content;
}
