# SEO Fixes (Local Only) — 2026-10-05

Local working-tree SEO improvements for https://www.hussainiitservices.com  
**No git push. No PR. Branch still `main...origin/main` with local modifications only.**

## Audit items addressed

1. **Animated H1 / SSR readability** — `AnimatedText` now inserts real space characters between words (fixes `GrowYourBusiness…` concatenation) and skips opacity:0 until hydrated; Hero H1 uses `immediate`. `PageHeader` skips opacity:0 until hydrated. `RevealOnScroll` no longer uses opacity:0 (transform-only) so location/service H1s stay readable to crawlers.
2. **OG image size** — Replaced `public/og-graph.png` (~1.5MB) with compressed `public/og-graph.jpg` (~97KB, 1200×630). Updated `defaultOgImage` in `src/lib/seo.ts`.
3. **Image alts** — Content-bearing logos: testimonial company logos, marquee tech logos, HomeAboutPreview logo, Logo icon-only alt clarified (`Hussaini IT Services logo`). Decorative+wordmark Logo still uses empty alt (correct).
4. **AggregateRating / review JSON-LD** — Removed `organizationReviewJsonLd` (Organization + AggregateRating) from home & testimonials and deleted the helper. Visible client reviews remain as `Review` items via `testimonialsItemListJsonLd` on `/testimonials` only.
5. **Home title/meta CTR** — Home title/description polished for Dubai & Ujjain + service mix; root layout default title/OG/Twitter aligned.
6. **About H1** — Replaced generic “Discover the Power of Digital Excellence” with specific Dubai & Ujjain studio H1; title/meta updated.
7. **City pages uniqueness** — Unique H1 headlines per city; `locationMetaTitle` / `locationMetaDescription` helpers; generateMetadata uses them (industry hook + unique intros).
8. **Contact email** — `companyInfo.email` → `info@hussainiitservices.com` (lowercase) for schema, footer, mailto, careers, legal pages.
9. **Meta keywords** — Stopped emitting `keywords` from root layout and `createPageMetadata` (Google ignores). Call-site keyword args retained but voided.
10. **Careers H1** — Plain readable string: “Careers at Hussaini IT Services — on-site jobs in Ujjain”; meta title/description clarified.
11. **Canonical / absolute URLs** — Confirmed `siteUrl` / `metadataBase` / canonicals / redirects use `https://www.hussainiitservices.com`. OG/Twitter image URLs absolute via `absoluteUrl()`. Internal nav/footer links remain root-relative (resolved against www host).
12. **robots.ts / sitemap.ts / metadataBase** — Reviewed; already correct against `siteUrl`. Admin remains `noindex` in `admin/layout.tsx`; robots disallows `/admin/` and `/api/`.
13. **OG / Twitter / JSON-LD on public templates** — All public `page.tsx` routes use `createPageMetadata` (canonical + OG + Twitter + robots) and page-level `PageSeo` JSON-LD where applicable. Root layout still emits Organization + WebSite + ProfessionalService once (deduped AggregateRating Organization removed).

## Files changed

### Assets
- `public/og-graph.png` — deleted (oversized)
- `public/og-graph.jpg` — added (~97KB)

### Core SEO
- `src/lib/seo.ts` — OG jpg + dimensions; no meta keywords; absolute OG/Twitter URLs; exported `absoluteUrl`; default description polish
- `src/lib/seo/jsonld.ts` — removed AggregateRating Organization helper
- `src/lib/seo/locations.ts` — unique headlines; `locationMetaTitle` / `locationMetaDescription`
- `src/lib/constants.ts` — lowercase contact email
- `src/app/layout.tsx` — metadataBase retained; dropped keywords; CTR title/OG/Twitter polish
- `src/app/robots.ts` — reviewed, unchanged
- `src/app/sitemap.ts` — reviewed, unchanged

### Components
- `src/components/ui/AnimatedText.tsx`
- `src/components/ui/PageHeader.tsx`
- `src/components/ui/RevealOnScroll.tsx`
- `src/components/ui/Logo.tsx`
- `src/components/ui/Marquee.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/careers/CareersPage.tsx`
- `src/components/sections/home/HomeAboutPreview.tsx`
- `src/components/sections/testimonials/TestimonialBentoCard.tsx`
- `src/components/sections/TestimonialsCarousel.tsx`
- `src/components/layout/Navbar.tsx` — home link `aria-label`

### Public pages
- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/careers/page.tsx`
- `src/app/testimonials/page.tsx`
- `src/app/services/page.tsx`
- `src/app/portfolio/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/best-it-services/page.tsx`
- `src/app/best-it-services/[slug]/page.tsx`
- `src/app/privacy-policy/page.tsx`
- `src/app/terms-and-conditions/page.tsx`

### Reviewed (already OK / light touch via shared helpers)
- `src/app/services/[slug]/page.tsx` — metadata + Service/FAQ/breadcrumb JSON-LD via helpers
- `src/app/portfolio/[slug]/page.tsx` — metadata + CreativeWork JSON-LD
- `src/app/blog/[slug]/page.tsx` — article metadata + BlogPosting JSON-LD
- `src/app/not-found.tsx` — noindex metadata
- `src/app/admin/layout.tsx` — robots noindex
- `src/app/manifest.ts` — reviewed

## Could not fully verify (runtime / CMS)

- Live Supabase blog/portfolio/testimonial **content** quality, cover alts, and whether every CMS image has meaningful alt text at runtime.
- Production HTML after deploy (this work is local-only; not built/deployed here).
- Search Console indexing status / rich-result eligibility after AggregateRating removal.

## Checks run

- `npx tsc --noEmit` — passed
- `git status -sb` — `main...origin/main` with local mods; **not ahead of origin** (no push)
- Left/right commit count vs `origin/main`: `0 0`

## Intentionally not done

- No `git push` / force-push / remote updates
- No PR creation
- No commit required (working tree left uncommitted for review)
- No deletion of product features — SEO/copy/metadata only

## Completeness re-audit — 2026-10-05 (this pass)

Deep checklist re-run across every public template + dynamic slug source. **Local only; no push.**

### PASS / FAIL by area

| Area | Result | Notes |
|------|--------|-------|
| 1. Static pages (home, about, contact, careers, testimonials, privacy, terms) | **PASS** | All use `createPageMetadata` (canonical + OG/Twitter + robots) + `PageSeo` JSON-LD. Careers now also has BreadcrumbList. |
| 2. Services index + every slug (16) | **PASS** | `generateMetadata` + Service/FAQ/Breadcrumb JSON-LD. Slugs match `allServices`. Unique OG images wired for 7 services with `/public/services/*.jpg`. |
| 3. Locations / best-it-services index + every city (15) | **PASS** | Unique meta via `locationMetaTitle`/`locationMetaDescription`; ProfessionalService + FAQ JSON-LD; BreadcrumbList added this pass (index + slug). Visible breadcrumb on location detail. |
| 4. Portfolio index + [slug] | **PASS** | `generateMetadata` + CreativeWork/ItemList + breadcrumbs. Cover alt → OG `imageAlt`. Detail cover uses `priority` for LCP. |
| 5. Blog index + [slug] | **PASS** (code) | Article metadata + BlogPosting (+ `url`) + breadcrumbs. Cover alt → OG `imageAlt`. **CMS caveat:** meta desc / cover alt / author quality depend on admin fields. |
| 6. Careers / job postings | **PASS** | No job detail routes — roles are `#id` sections on `/careers`. Each role has `h3` + `id={role.id}`. Four `JobPosting` JSON-LD objects via `careersJsonLd()`. BreadcrumbList added. |
| 7. Global (metadataBase, robots, sitemap, redirects, noindex admin, trailing slash, OG absolute, Org JSON-LD once) | **PASS** | `metadataBase`/`siteUrl` www; robots disallow `/admin/` `/api/`; `sitemap.ts` includes static+services+cities+CMS blog/portfolio; `sitemap.txt` now mirrors that (async); apex→www 301 in `next.config`; admin `noindex`; no trailingSlash (consistent); root OG/Twitter absolute; single Org+WebSite+ProfessionalService in root layout; AggregateRating Organization removed earlier; 404 noindex. No hreflang (single-language `en` — intentional). No pagination routes. |
| 8. On-page tech (H1 SSR, alts, LCP, font-display, structured data) | **PASS** | H1 readable on SSR (AnimatedText/PageHeader/RevealOnScroll fixes from prior pass). Cover alt helpers used on blog/portfolio. Poppins `display: "swap"`. No leftover AggregateRating. |
| 9. Feeds (feed.xml, llms.txt / llm.txt) | **PASS** | RSS: atom self-link, author, meta description, optional enclosure. `llms.txt`/`llm.txt` list pages/services/locations. |

### Files changed in this completeness pass

- `src/lib/seo.ts` — optional `imageAlt` for OG
- `src/lib/seo/jsonld.ts` — BlogPosting `url`; Service `image` when asset exists
- `src/lib/seo/content.ts` — `buildSitemapTxt` async; includes blog + portfolio URLs
- `src/lib/seo/service-visuals.ts` — `serviceOgImagePath` map
- `src/lib/data/fetch.ts` — blog row normalize; static portfolio fallback cover alt = title
- `src/app/layout.tsx` — absolute default OG/Twitter image URLs
- `src/app/feed.xml/route.ts` — RSS completeness
- `src/app/sitemap.txt/route.ts` — revalidate + await full URL list
- `src/app/careers/page.tsx` — BreadcrumbList
- `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx` — BreadcrumbList; OG imageAlt
- `src/app/best-it-services/page.tsx`, `src/app/best-it-services/[slug]/page.tsx` — BreadcrumbList
- `src/app/portfolio/[slug]/page.tsx` — OG imageAlt
- `src/app/services/[slug]/page.tsx` — per-service OG image when available
- `src/components/blog/BlogArticle.tsx` — visible breadcrumb nav
- `src/components/sections/locations/LocationDetail.tsx` — visible breadcrumb nav
- `src/components/sections/portfolio/PortfolioProject.tsx` — visible breadcrumb; cover `priority`
- `src/components/ui/PortfolioCover.tsx` — `priority` prop

### (A) What code can guarantee

- Every public **template** emits title, description, canonical, robots, OG/Twitter, and page-appropriate JSON-LD.
- Every **static + service + city** URL is in `sitemap.xml` / `sitemap.txt` generators.
- CMS blog/portfolio URLs are included in sitemap generators when Supabase returns published rows.
- Admin is noindex; apex host redirects to www; no AggregateRating on Organization.

### (B) What still needs CMS / runtime / Search Console

- Fill meaningful `meta_description`, `cover_image_alt`, and `author` on every blog/portfolio item in admin (code falls back to title/excerpt).
- Compress/optimize already-deployed CMS images in Supabase storage if oversized.
- Submit / resubmit sitemap in Google Search Console; monitor JobPosting / Article rich results after deploy.
- Content uniqueness for city pages is coded, but ranking still depends on copy quality vs competitors.
- Deploy this local working tree — nothing is live until you ship.
- JobPosting `validThrough` currently `2026-12-31` — extend in `src/lib/seo/careers.ts` before expiry.
- Remaining services without `/public/services/{slug}.jpg` still use the default OG image (add assets if you want unique previews).

### Checks

- `npx tsc --noEmit` — passed
- `git rev-list --left-right --count origin/main...HEAD` → `0 0` (**no push**)
