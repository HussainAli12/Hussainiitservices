import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { defaultSiteStats } from "@/lib/constants";
import type { AdminOverview } from "@/lib/admin/overview";

/**
 * Dashboard summary in one round trip. Uses head-only count queries so the overview no longer
 * downloads every testimonial, project, and post just to show a number.
 */
export async function GET() {
  try {
    const authed = await getAdminSession();
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    if (!supabase) {
      const empty: AdminOverview = {
        counts: { testimonials: 0, portfolio: 0, portfolioPublished: 0, blogs: 0, blogsPublished: 0, messages: 0, messagesThisWeek: 0 },
        recentMessages: [],
        stats: { id: "main", ...defaultSiteStats, updated_at: new Date().toISOString() },
      };
      return NextResponse.json({ data: empty });
    }

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const count = (table: string) => supabase.from(table).select("id", { count: "exact", head: true });

    const [testimonials, portfolio, portfolioPublished, blogs, blogsPublished, messages, messagesThisWeek, recent, stats] =
      await Promise.all([
        count("testimonials"),
        count("portfolio"),
        count("portfolio").eq("is_published", true),
        count("blogs"),
        count("blogs").eq("is_published", true),
        count("contact_submissions"),
        count("contact_submissions").gte("created_at", weekAgo),
        supabase
          .from("contact_submissions")
          .select("id, name, email, subject, message, created_at")
          .order("created_at", { ascending: false })
          .limit(6),
        supabase.from("site_stats").select("*").eq("id", "main").maybeSingle(),
      ]);

    const failed = [testimonials, portfolio, blogs, messages, recent].find((result) => result.error);
    if (failed?.error) {
      console.error("Admin overview error:", failed.error.message);
      return NextResponse.json({ error: failed.error.message }, { status: 500 });
    }

    const data: AdminOverview = {
      counts: {
        testimonials: testimonials.count ?? 0,
        portfolio: portfolio.count ?? 0,
        portfolioPublished: portfolioPublished.count ?? 0,
        blogs: blogs.count ?? 0,
        blogsPublished: blogsPublished.count ?? 0,
        messages: messages.count ?? 0,
        messagesThisWeek: messagesThisWeek.count ?? 0,
      },
      recentMessages: recent.data ?? [],
      stats: stats.data ?? { id: "main", ...defaultSiteStats, updated_at: new Date().toISOString() },
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Admin overview failed:", error);
    return NextResponse.json({ error: "Failed to load the overview." }, { status: 500 });
  }
}
