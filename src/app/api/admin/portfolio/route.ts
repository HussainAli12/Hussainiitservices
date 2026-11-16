import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { normalizePortfolioSeoFields } from "@/lib/seo/portfolio";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import type { DbPortfolio, PortfolioGalleryImage } from "@/lib/types/database";
import { slugify } from "@/lib/utils/slug";

const OPTIONAL_COLUMNS = [
  "slug",
  "client_name",
  "challenge",
  "solution",
  "results",
  "tech_stack",
  "content",
  "gallery",
  "cover_image_alt",
  "meta_description",
  "meta_keywords",
  "logo_url",
  "cover_type",
  "updated_at",
] as const;

function isMissingColumnError(message: string) {
  return OPTIONAL_COLUMNS.some((column) => message.includes(column));
}

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

function normalizePortfolioRow(row: Record<string, unknown>): DbPortfolio {
  return {
    ...(row as unknown as DbPortfolio),
    slug: String(row.slug || slugify(String(row.title || "")) || row.id || ""),
    client_name: (row.client_name as string | null) ?? null,
    challenge: (row.challenge as string | null) ?? null,
    solution: (row.solution as string | null) ?? null,
    results: (row.results as string | null) ?? null,
    tech_stack: (row.tech_stack as string[] | null) ?? [],
    content: String(row.content ?? ""),
    gallery: normalizeGallery(row.gallery),
    cover_image_alt: (row.cover_image_alt as string | null) ?? null,
    meta_description: (row.meta_description as string | null) ?? null,
    meta_keywords: (row.meta_keywords as string[] | null) ?? null,
    logo_url: (row.logo_url as string | null) ?? null,
    cover_type: row.cover_type === "logo" ? "logo" : "screenshot",
  };
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function buildPayload(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const slug = slugify(String(body.slug || title)) || `project-${Date.now()}`;
  const seoFields = normalizePortfolioSeoFields(body);

  return {
    title,
    slug,
    category: String(body.category ?? "").trim(),
    client_name: body.client_name ? String(body.client_name).trim() : null,
    description,
    challenge: body.challenge ? String(body.challenge).trim() : null,
    solution: body.solution ? String(body.solution).trim() : null,
    results: body.results ? String(body.results).trim() : null,
    highlights: parseStringArray(body.highlights),
    tags: parseStringArray(body.tags),
    tech_stack: parseStringArray(body.tech_stack),
    content: String(body.content ?? ""),
    gallery: normalizeGallery(body.gallery),
    logo_url: body.logo_url ? String(body.logo_url).trim() : null,
    image_url: body.image_url ? String(body.image_url).trim() : null,
    cover_type: body.cover_type === "logo" ? "logo" : "screenshot",
    project_url: body.project_url ? String(body.project_url).trim() : null,
    is_published: body.is_published ?? true,
    sort_order: Number(body.sort_order) || 0,
    updated_at: new Date().toISOString(),
    ...seoFields,
  };
}

function stripOptionalFields(payload: Record<string, unknown>, columns: readonly string[]) {
  const next = { ...payload };
  for (const column of columns) {
    delete next[column];
  }
  return next;
}

async function writePortfolioRow(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  mode: "insert" | "update",
  payload: Record<string, unknown>,
  id?: string,
) {
  let currentPayload = { ...payload };

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const query =
      mode === "insert"
        ? supabase.from("portfolio").insert(currentPayload).select().single()
        : supabase.from("portfolio").update(currentPayload).eq("id", id!).select().single();

    const result = await query;

    if (!result.error) {
      return result;
    }

    if (!isMissingColumnError(result.error.message)) {
      return result;
    }

    const missingColumn = OPTIONAL_COLUMNS.find((column) =>
      result.error?.message.includes(column),
    );

    if (!missingColumn) {
      return result;
    }

    currentPayload = stripOptionalFields(currentPayload, [missingColumn]);
  }

  return supabase.from("portfolio").select("*").limit(0);
}

export async function GET() {
  try {
    const authed = await getAdminSession();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    if (!supabase) return NextResponse.json({ data: [] });

    const { data, error } = await supabase
      .from("portfolio")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Portfolio GET error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: (data ?? []).map((row) => normalizePortfolioRow(row as Record<string, unknown>)),
    });
  } catch (error) {
    console.error("Portfolio GET failed:", error);
    return NextResponse.json({ error: "Failed to load portfolio." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authed = await getAdminSession();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });
    }

    const body = await request.json();
    const payload = buildPayload(body);

    if (!payload.title || !payload.category || !payload.description) {
      return NextResponse.json(
        { error: "Title, category, and description are required." },
        { status: 400 },
      );
    }

    const result = await writePortfolioRow(supabase, "insert", payload);

    if (result.error) {
      console.error("Portfolio POST error:", result.error.message);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    revalidatePublicContent();

    return NextResponse.json({
      data: normalizePortfolioRow(result.data as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Portfolio POST failed:", error);
    return NextResponse.json({ error: "Failed to add portfolio project." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authed = await getAdminSession();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });
    }

    const body = await request.json();
    const id = body.id as string;
    if (!id) return NextResponse.json({ error: "Portfolio id is required." }, { status: 400 });

    const payload = buildPayload(body);

    if (!payload.title || !payload.category || !payload.description) {
      return NextResponse.json(
        { error: "Title, category, and description are required." },
        { status: 400 },
      );
    }

    const result = await writePortfolioRow(supabase, "update", payload, id);

    if (result.error) {
      console.error("Portfolio PUT error:", result.error.message);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    revalidatePublicContent();

    return NextResponse.json({
      data: normalizePortfolioRow(result.data as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Portfolio PUT failed:", error);
    return NextResponse.json({ error: "Failed to update portfolio project." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authed = await getAdminSession();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();
    const supabase = createAdminClient();
    if (!supabase) return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });

    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) {
      console.error("Portfolio DELETE error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePublicContent();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Portfolio DELETE failed:", error);
    return NextResponse.json({ error: "Failed to delete portfolio project." }, { status: 500 });
  }
}
