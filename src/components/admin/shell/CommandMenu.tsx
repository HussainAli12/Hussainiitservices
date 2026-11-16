"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { ADMIN_NAV } from "@/components/admin/shell/nav";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/admin/ui/command";

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();

  function run(action: () => void) {
    onOpenChange(false);
    action();
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search admin" description="Jump to a page or run an action.">
      <CommandInput placeholder="Search pages and actions…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        {ADMIN_NAV.map((group) => (
          <CommandGroup key={group.label} heading={group.label}>
            {group.items.map((item) => (
              <CommandItem
                key={item.href}
                value={[item.label, ...(item.keywords ?? [])].join(" ")}
                onSelect={() => run(() => router.push(item.href))}
              >
                <item.icon />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="General">
          <CommandItem value="view website public site" onSelect={() => run(() => window.open("/", "_blank"))}>
            <ExternalLink />
            View website
          </CommandItem>
          <CommandItem
            value="log out sign out"
            onSelect={() =>
              run(async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                router.replace("/admin/login");
                router.refresh();
              })
            }
          >
            <LogOut />
            Log out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
