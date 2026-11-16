import {
  BarChart3,
  CalendarCheck,
  SquareKanban,
  Contact,
  BookOpen,
  Briefcase,
  Inbox,
  LayoutDashboard,
  LineChart,
  Star,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** API resource the page reads; warmed in the background so navigation is instant. */
  resource: string;
  exact?: boolean;
  keywords?: string[];
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Workspace",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard, resource: "/api/admin/overview", exact: true, keywords: ["dashboard", "home"] },
      { href: "/admin/messages", label: "Inbox", icon: Inbox, resource: "/api/admin/contacts", keywords: ["messages", "contacts", "enquiries", "leads"] },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/sales", label: "My day", icon: CalendarCheck, resource: "/api/admin/crm/tasks", exact: true, keywords: ["today", "follow ups", "tasks", "crm"] },
      { href: "/admin/sales/customers", label: "Customers", icon: Contact, resource: "/api/admin/crm/customers", keywords: ["leads", "clients", "crm", "contacts"] },
      { href: "/admin/sales/pipeline", label: "Pipeline", icon: SquareKanban, resource: "/api/admin/crm/deals", keywords: ["deals", "kanban", "stages", "crm"] },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase, resource: "/api/admin/portfolio", keywords: ["projects", "case studies"] },
      { href: "/admin/blog", label: "Blog", icon: BookOpen, resource: "/api/admin/blogs", keywords: ["posts", "articles"] },
      { href: "/admin/testimonials", label: "Testimonials", icon: Star, resource: "/api/admin/testimonials", keywords: ["reviews", "quotes"] },
    ],
  },
  {
    label: "Analytics",
    items: [
      { href: "/admin/insights", label: "Insights", icon: LineChart, resource: "/api/admin/insights", keywords: ["google", "analytics", "search console", "seo"] },
      { href: "/admin/stats", label: "Site stats", icon: BarChart3, resource: "/api/admin/stats", keywords: ["numbers", "counters"] },
    ],
  },
];

export const ADMIN_NAV_ITEMS = ADMIN_NAV.flatMap((group) => group.items);

export function isNavActive(pathname: string, item: AdminNavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function activeNavItem(pathname: string) {
  return ADMIN_NAV_ITEMS.find((item) => isNavActive(pathname, item));
}
