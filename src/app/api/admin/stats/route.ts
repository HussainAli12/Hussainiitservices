import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import { defaultSiteStats } from "@/lib/constants";

export async function GET() {
  try {
    const authed = await getAdminSession();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ data: { id: "main", ...defaultSiteStats, updated_at: new Date().toISOString() } });
    }

    const { data, error } = await supabase.from("site_stats").select("*").eq("id", "main").maybeSingle();

    if (error) {
      console.error("Site stats GET error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data ?? { id: "main", ...defaultSiteStats, updated_at: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Site stats GET failed:", error);
    return NextResponse.json({ error: "Failed to load site stats." }, { status: 500 });
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
    const payload = {
      id: "main",
      projects_delivered: Number(body.projects_delivered) || 0,
      global_clients: Number(body.global_clients) || 0,
      years_experience: Number(body.years_experience) || 0,
      client_satisfaction: Number(body.client_satisfaction) || 0,
      projects_completed: Number(body.projects_completed) || 0,
      countries_served: Number(body.countries_served) || 0,
      happy_clients: Number(body.happy_clients) || 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("site_stats")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Site stats PUT error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePublicContent();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Site stats PUT failed:", error);
    return NextResponse.json({ error: "Failed to update site stats." }, { status: 500 });
  }
}
