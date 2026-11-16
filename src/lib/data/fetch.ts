import { createAdminClient, createServerClient } from "@/lib/supabase/server";
import { defaultSiteStats, projects, testimonials } from "@/lib/constants";
import type {
  DbBlog,
  DbPortfolio,
  DbSiteStats,
  DbTestimonial,
  PortfolioGalleryImage,
} from "@/lib/types/database";
import { slugify } from "@/lib/utils/slug";

function normalizeGallery(value: unknown): PortfolioGalleryImage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is PortfolioGalleryImage =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as PortfolioGalleryImage).url === "string" &&
        typeof (item as PortfolioGalleryImage).alt === "string",
    )
    .map((item) => ({ url: item.url.trim(), alt: item.alt.trim() }))
    .filter((item) => item.url && item.alt);
}

function normalizePortfolioRow(item: DbPortfolio): DbPortfolio {
  return {
    ...item,
    slug: item.slug || slugify(item.title) || item.id,
    client_name: item.client_name ?? null,
    challenge: item.challenge ?? null,
    solution: item.solution ?? null,
    results: item.results ?? null,
    tech_stack: item.tech_stack ?? [],
    content: item.content ?? "",
    gallery: normalizeGallery(item.gallery),
    cover_image_alt: item.cover_image_alt ?? null,
    meta_description: item.meta_description ?? null,
    meta_keywords: item.meta_keywords ?? null,
    logo_url: item.logo_url ?? null,
    cover_type: item.cover_type === "logo" ? "logo" : "screenshot",
    updated_at: item.updated_at ?? null,
  };
}

function mapStaticPortfolio(): DbPortfolio[] {
  return projects.map((p, i) => ({
    id: p.id,
    slug: slugify(p.title) || p.id,
    title: p.title,
    category: p.category,
    client_name: null,
    description: p.description,
    challenge: null,
    solution: null,
    results: null,
    highlights: p.highlights,
    tags: p.tags,
    tech_stack: p.tags,
    content: "",
    gallery: [],
    logo_url: null,
    image_url: p.image ?? null,
    cover_type: "screenshot" as const,
    cover_image_alt: p.title,
    meta_description: null,
    meta_keywords: null,
    project_url: null,
    is_published: true,
    sort_order: i,
    created_at: new Date().toISOString(),
  }));
}

function mapStaticTestimonials(): DbTestimonial[] {
  return testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    company: t.company,
    quote: t.quote,
    rating: t.rating,
    website_url: null,
    location: null,
    logo_url: null,
    is_published: true,
    created_at: new Date().toISOString(),
  }));
}


function normalizeBlogRow(item: DbBlog): DbBlog {
  return {
    ...item,
    excerpt: item.excerpt ?? null,
    cover_image_url: item.cover_image_url ?? null,
    cover_image_alt: item.cover_image_alt ?? null,
    meta_description: item.meta_description ?? null,
    meta_keywords: item.meta_keywords ?? null,
    author: item.author ?? null,
    updated_at: item.updated_at || item.published_at || item.created_at,
  };
}

/** Prefer service role so public pages always match admin data (RLS-safe on server only). */
function getReadClient() {
  return createAdminClient() ?? createServerClient();
}

export async function fetchPortfolio(): Promise<DbPortfolio[]> {
  const supabase = getReadClient();
  if (!supabase) return mapStaticPortfolio();

  const full = await supabase
    .from("portfolio")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (full.error) {
    console.error("fetchPortfolio error:", full.error.message);

    const legacy = await supabase
      .from("portfolio")
      .select(
        "id, title, category, description, highlights, tags, logo_url, image_url, cover_type, project_url, is_published, sort_order, created_at",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (legacy.error) {
      console.error("fetchPortfolio legacy error:", legacy.error.message);
      return mapStaticPortfolio();
    }

    if (!legacy.data?.length) return mapStaticPortfolio();

    return (legacy.data as DbPortfolio[]).map(normalizePortfolioRow);
  }

  if (!full.data?.length) return mapStaticPortfolio();

  return (full.data as DbPortfolio[]).map(normalizePortfolioRow);
}

export async function fetchRecentPortfolio(limit = 4): Promise<DbPortfolio[]> {
  const supabase = getReadClient();
  if (!supabase) return mapStaticPortfolio().slice(0, limit);

  const full = await supabase
    .from("portfolio")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (full.error) {
    console.error("fetchRecentPortfolio error:", full.error.message);

    const legacy = await supabase
      .from("portfolio")
      .select(
        "id, title, category, description, highlights, tags, logo_url, image_url, cover_type, project_url, is_published, sort_order, created_at",
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (legacy.error) {
      return mapStaticPortfolio().slice(0, limit);
    }

    return (legacy.data as DbPortfolio[]).map(normalizePortfolioRow);
  }

  if (!full.data?.length) return mapStaticPortfolio().slice(0, limit);

  return (full.data as DbPortfolio[]).map(normalizePortfolioRow);
}

export async function fetchPortfolioBySlug(slug: string): Promise<DbPortfolio | null> {
  const supabase = getReadClient();
  if (!supabase) {
    return mapStaticPortfolio().find((item) => item.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("fetchPortfolioBySlug error:", error.message);
    return null;
  }

  return data ? normalizePortfolioRow(data as DbPortfolio) : null;
}

export async function fetchPortfolioSlugs(): Promise<string[]> {
  const items = await fetchPortfolio();
  return items.map((item) => item.slug);
}

export async function fetchRelatedPortfolio(
  project: DbPortfolio,
  limit = 4,
): Promise<DbPortfolio[]> {
  const items = await fetchPortfolio();
  const sameCategory = items.filter(
    (item) => item.id !== project.id && item.category === project.category,
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const fallback = items.filter((item) => item.id !== project.id);
  const merged = [...sameCategory];

  for (const item of fallback) {
    if (merged.length >= limit) break;
    if (!merged.some((existing) => existing.id === item.id)) {
      merged.push(item);
    }
  }

  return merged.slice(0, limit);
}

export async function fetchTestimonials(): Promise<DbTestimonial[]> {
  const supabase = getReadClient();
  if (!supabase) return mapStaticTestimonials();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchTestimonials error:", error.message);
    return [];
  }

  if (!data?.length) return [];

  return (data as DbTestimonial[]).map((item) => ({
    ...item,
    website_url: item.website_url ?? null,
    location: item.location ?? null,
    logo_url: item.logo_url ?? null,
  }));
}

export async function fetchBlogs(): Promise<DbBlog[]> {
  const supabase = getReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchBlogs error:", error.message);
    return [];
  }

  return ((data as DbBlog[]) ?? []).map(normalizeBlogRow);
}

export async function fetchBlogBySlug(slug: string): Promise<DbBlog | null> {
  const supabase = getReadClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("fetchBlogBySlug error:", error.message);
    return null;
  }

  return data ? normalizeBlogRow(data as DbBlog) : null;
}

export async function fetchSiteStats(): Promise<DbSiteStats> {
  const fallback: DbSiteStats = {
    id: "main",
    ...defaultSiteStats,
    updated_at: new Date().toISOString(),
  };

  const supabase = getReadClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase.from("site_stats").select("*").eq("id", "main").maybeSingle();

  if (error) {
    console.error("fetchSiteStats error:", error.message);
    return fallback;
  }

  return (data as DbSiteStats) ?? fallback;
}
