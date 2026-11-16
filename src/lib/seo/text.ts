/** Trim to a word boundary so meta descriptions stay under Google's ~155-char snippet */
export function truncateMeta(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—–-]+$/, "")}…`;
}

const TITLE_MAX = 60;

/**
 * Fit a page title into Google's ~60-char window.
 * 1. "<title> | <brand>" when it fits (the format we want everywhere)
 * 2. the title alone (absolute) when only the brand pushes it over
 * 3. drop trailing " — …", " | …" or ": …" segments (CMS titles often have subtitles)
 * 4. otherwise keep the full title — a complete title Google truncates beats a cut-off fragment
 *    (the SEO audit script flags these so the post title can be shortened in /admin)
 */
export function fitTitle(title: string, brand: string): { text: string; withBrand: boolean } {
  const clean = title.replace(/\s+/g, " ").trim();
  if (`${clean} | ${brand}`.length <= TITLE_MAX) return { text: clean, withBrand: true };
  if (clean.length <= TITLE_MAX) return { text: clean, withBrand: false };

  let candidate = clean;
  const separator = /(\s[—–|]\s|:\s)(?!.*(\s[—–|]\s|:\s))/;
  while (candidate.length > TITLE_MAX && separator.test(candidate)) {
    candidate = candidate.slice(0, candidate.search(separator)).trim();
  }
  if (candidate.length <= TITLE_MAX && candidate.length >= 20) return { text: candidate, withBrand: false };

  return { text: clean, withBrand: false };
}
