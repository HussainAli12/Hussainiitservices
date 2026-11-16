#!/usr/bin/env node
/**
 * On-page SEO audit for every URL in sitemap.txt.
 *
 *   node scripts/seo-audit.mjs [baseUrl]        # default http://localhost:3000
 *
 * Checks: title ≤ 60, description ≤ 155, canonical, exactly one H1, OG + Twitter image,
 * JSON-LD parses, BreadcrumbList on inner pages, <img> without alt, hreflang pairs.
 * Exits 1 when any error is found.
 */
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function meta(html, attr, name) {
  const re = new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`, "i");
  const re2 = new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`, "i");
  return decode((html.match(re) || html.match(re2) || [])[1] ?? "");
}

/** Google rich-result required properties (subset relevant to this site) */
const REQUIRED = {
  BreadcrumbList: (d) => Array.isArray(d.itemListElement) && d.itemListElement.length > 0 &&
    d.itemListElement.every((li, i) => li.position === i + 1 && li.name && li.item),
  FAQPage: (d) => Array.isArray(d.mainEntity) && d.mainEntity.length > 0 &&
    d.mainEntity.every((q) => q["@type"] === "Question" && q.name && q.acceptedAnswer?.text),
  BlogPosting: (d) => d.headline && d.image && d.datePublished && d.author?.name,
  Organization: (d) => d.name && d.url && d.logo,
  ProfessionalService: (d) => d.name && (d.address || d.areaServed),
  Service: (d) => d.name && d.provider && d.areaServed,
  WebSite: (d) => d.name && d.url,
  ItemList: (d) => Array.isArray(d.itemListElement),
  JobPosting: (d) => d.title && d.description && d.datePosted && d.hiringOrganization && d.jobLocation,
};

function jsonLdTypes(html, errors) {
  const types = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(match[1]);
      for (const item of Array.isArray(data) ? data : [data]) {
        types.push(item["@type"]);
        const check = REQUIRED[item["@type"]];
        if (check && !check(item)) errors.push(`${item["@type"]} missing required properties`);
      }
    } catch {
      errors.push("invalid JSON-LD");
    }
  }
  return types.flat();
}

const sitemap = await (await fetch(`${base}/sitemap.txt`)).text();
const urls = sitemap
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((url) => base + new URL(url).pathname);

let errorCount = 0;
const rows = [];

for (const url of urls) {
  const res = await fetch(url);
  const html = await res.text();
  const path = new URL(url).pathname;
  const errors = [];
  const warnings = [];

  if (res.status !== 200) errors.push(`HTTP ${res.status}`);
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? "");
  const description = meta(html, "name", "description");
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const ogImage = meta(html, "property", "og:image");
  const twImage = meta(html, "name", "twitter:image");
  const types = jsonLdTypes(html, errors);
  const imgsNoAlt = [...html.matchAll(/<img(?![^>]*\balt=)[^>]*>/g)].length;
  const hreflangs = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)"/g)].map((m) => m[1]);

  if (!title) errors.push("missing title");
  else if (title.length > 60) warnings.push(`title ${title.length} chars`);
  if (!description) errors.push("missing description");
  else if (description.length > 155) warnings.push(`description ${description.length} chars`);
  if (!canonical) errors.push("missing canonical");
  if (h1s !== 1) errors.push(`${h1s} H1s`);
  if (!ogImage) errors.push("missing og:image");
  if (!twImage) warnings.push("missing twitter:image");
  if (path !== "/" && !types.includes("BreadcrumbList")) errors.push("no BreadcrumbList");
  if (imgsNoAlt) errors.push(`${imgsNoAlt} <img> without alt`);
  if (hreflangs.length && !hreflangs.includes("x-default")) warnings.push("hreflang without x-default");

  errorCount += errors.length;
  rows.push({ path, title, titleLen: title.length, descLen: description.length, types, hreflangs, errors, warnings });
}

for (const row of rows) {
  const flag = row.errors.length ? "✗" : row.warnings.length ? "!" : "✓";
  console.log(`${flag} ${row.path}  [${row.titleLen}/${row.descLen}]  ${row.title}`);
  if (process.env.VERBOSE) console.log(`    types: ${[...new Set(row.types)].join(", ")}${row.hreflangs.length ? `  hreflang: ${row.hreflangs.join(",")}` : ""}`);
  for (const e of row.errors) console.log(`    ERROR ${e}`);
  for (const w of row.warnings) console.log(`    warn  ${w}`);
}

const titles = new Map();
for (const row of rows) titles.set(row.title, [...(titles.get(row.title) ?? []), row.path]);
for (const [title, paths] of titles) {
  if (paths.length > 1) {
    console.log(`DUPLICATE TITLE "${title}": ${paths.join(", ")}`);
    errorCount += 1;
  }
}

console.log(`\n${rows.length} URLs, ${errorCount} errors, ${rows.reduce((n, r) => n + r.warnings.length, 0)} warnings`);
process.exit(errorCount ? 1 : 0);
