import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { normalizeBlogSeoFields } from "@/lib/seo/blog";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import { slugify } from "@/lib/utils/slug";

export async function GET() {
  try {
    const authed = await getAdminSession();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    if (!supabase) return NextResponse.json({ data: [] });

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Blogs GET error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("Blogs GET failed:", error);
    return NextResponse.json({ error: "Failed to load blogs." }, { status: 500 });
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
    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const slug = slugify(String(body.slug || title)) || `post-${Date.now()}`;
    const seoFields = normalizeBlogSeoFields(body);
    const payload = {
      title,
      slug,
      excerpt: body.excerpt ? String(body.excerpt).trim() : null,
      content,
      cover_image_url: body.cover_image_url ? String(body.cover_image_url).trim() : null,
      ...seoFields,
      author: body.author ? String(body.author).trim() : "Hussaini IT Services",
      is_published: body.is_published ?? true,
      published_at: body.published_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("blogs").insert(payload).select().single();
    if (error) {
      console.error("Blogs POST error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePublicContent();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Blogs POST failed:", error);
    return NextResponse.json({ error: "Failed to add blog post." }, { status: 500 });
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
    if (!id) return NextResponse.json({ error: "Blog id is required." }, { status: 400 });

    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const slug = slugify(String(body.slug || title)) || `post-${Date.now()}`;
    const seoFields = normalizeBlogSeoFields(body);
    const payload = {
      title,
      slug,
      excerpt: body.excerpt ? String(body.excerpt).trim() : null,
      content,
      cover_image_url: body.cover_image_url ? String(body.cover_image_url).trim() : null,
      ...seoFields,
      author: body.author ? String(body.author).trim() : "Hussaini IT Services",
      is_published: body.is_published ?? true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("blogs").update(payload).eq("id", id).select().single();
    if (error) {
      console.error("Blogs PUT error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePublicContent();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Blogs PUT failed:", error);
    return NextResponse.json({ error: "Failed to update blog post." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authed = await getAdminSession();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();
    const supabase = createAdminClient();
    if (!supabase) return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });

    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) {
      console.error("Blogs DELETE error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePublicContent();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blogs DELETE failed:", error);
    return NextResponse.json({ error: "Failed to delete blog post." }, { status: 500 });
  }
}
