"use client";

import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, ExternalLink, LogOut, Search } from "lucide-react";
import { ADMIN_NAV, ADMIN_NAV_ITEMS, activeNavItem, isNavActive } from "@/components/admin/shell/nav";
import { CommandMenu } from "@/components/admin/shell/CommandMenu";
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar";
import { Button } from "@/components/admin/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { Separator } from "@/components/admin/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/admin/ui/sidebar";
import { prefetch, useAdminResource } from "@/components/admin/use-admin-resource";
import type { AdminOverview } from "@/lib/admin/overview";

function useLogout() {
  const router = useRouter();
  return async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };
}

function AppSidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const { isMobile, setOpenMobile } = useSidebar();
  const overview = useAdminResource<AdminOverview>("/api/admin/overview");
  const newMessages = overview.data?.counts.messagesThisWeek ?? 0;

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Hussaini IT Services">
              <Link href="/admin">
                <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white shadow-xs ring-1 ring-sidebar-border">
                  <Image src="/logo.svg" alt="" width={20} height={20} />
                </span>
                <span className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold text-sidebar-accent-foreground">Hussaini IT</span>
                  <span className="truncate text-xs text-muted-foreground">Admin workspace</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {ADMIN_NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isNavActive(pathname, item)} tooltip={item.label}>
                    <Link
                      href={item.href}
                      onMouseEnter={() => prefetch(item.resource)}
                      onFocus={() => prefetch(item.resource)}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.href === "/admin/messages" && newMessages > 0 && (
                    <SidebarMenuBadge title="Received in the last 7 days">{newMessages}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary text-xs font-medium text-primary-foreground">
                      H
                    </AvatarFallback>
                  </Avatar>
                  <span className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-sidebar-accent-foreground">Admin</span>
                    <span className="truncate text-xs text-muted-foreground">hussainiitservices.com</span>
                  </span>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              >
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Signed in as admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/" target="_blank" rel="noreferrer">
                    <ExternalLink />
                    View website
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void logout()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function Topbar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const pathname = usePathname();
  const current = activeNavItem(pathname);
  const group = ADMIN_NAV.find((entry) => current && entry.items.includes(current));

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 rounded-t-xl border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/70">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        {group && <span className="hidden text-muted-foreground sm:inline">{group.label}</span>}
        {group && <span className="hidden text-muted-foreground/50 sm:inline">/</span>}
        <span className="truncate font-medium">{current?.label ?? "Admin"}</span>
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSearch}
          className="h-8 w-9 justify-start gap-2 px-0 text-muted-foreground shadow-none sm:w-56 sm:px-3"
        >
          <Search className="mx-auto sm:mx-0" />
          <span className="hidden sm:inline">Search…</span>
          <kbd className="pointer-events-none ml-auto hidden h-5 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
            ⌘K
          </kbd>
        </Button>
        <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink />
            Website
          </a>
        </Button>
      </div>
    </header>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useLayoutEffect(() => {
    // The sidebar component persists its state in this cookie; restore it before paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a client-only value
    if (document.cookie.includes("sidebar_state=false")) setSidebarOpen(false);
  }, []);

  useEffect(() => {
    // Warm every section's data once the dashboard is idle, so the first click on any page
    // already has rows to render. Lists are small (≤100 rows each).
    const warm = () => ADMIN_NAV_ITEMS.forEach((item) => prefetch(item.resource, 60_000));
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(warm, 800);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <Topbar onOpenSearch={() => setSearchOpen(true)} />
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </SidebarInset>
      <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} />
    </SidebarProvider>
  );
}
