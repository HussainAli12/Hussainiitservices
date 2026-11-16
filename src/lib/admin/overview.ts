import type { DbContactSubmission, DbSiteStats } from "@/lib/types/database";

export interface AdminOverview {
  counts: {
    testimonials: number;
    portfolio: number;
    portfolioPublished: number;
    blogs: number;
    blogsPublished: number;
    messages: number;
    messagesThisWeek: number;
  };
  recentMessages: Pick<DbContactSubmission, "id" | "name" | "email" | "subject" | "message" | "created_at">[];
  stats: DbSiteStats;
}
