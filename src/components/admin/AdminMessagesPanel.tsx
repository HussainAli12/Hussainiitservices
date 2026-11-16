"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox, Mail, MoreHorizontal, Phone, Reply, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { CRM, crmWrite } from "@/components/admin/crm/api";
import { EmptyState } from "@/components/admin/shell/AdminPageHeader";
import { SearchInput, TableToolbar } from "@/components/admin/kit";
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { Separator } from "@/components/admin/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/admin/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { formatRelative, initials } from "@/lib/admin/format";
import type { DbContactSubmission } from "@/lib/types/database";

function replyHref(item: DbContactSubmission) {
  const subject = encodeURIComponent(`Re: ${item.subject || "Your inquiry"}`);
  return `mailto:${item.email}?subject=${subject}`;
}

export function AdminMessagesPanel({
  items,
  onRequestDelete,
}: {
  items: DbContactSubmission[];
  onRequestDelete: (item: DbContactSubmission) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DbContactSubmission | null>(null);

  async function addAsLead(item: DbContactSubmission) {
    try {
      const result = await crmWrite<{ customer_id: string; created: boolean }>("POST", CRM.enquiries, {
        submission_id: item.id,
      });
      toast.success(result.created ? "Added to Sales as a lead" : "Already in Sales");
      router.push(`/admin/sales/customers/${result.customer_id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add the lead.");
    }
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.name, item.email, item.subject, item.message, item.phone].some((value) =>
        value?.toLowerCase().includes(needle),
      ),
    );
  }, [items, query]);

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar end={<span className="text-xs text-muted-foreground">{items.length} received</span>}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search messages" />
      </TableToolbar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={items.length === 0 ? "Inbox zero" : "No matches"}
          description={items.length === 0 ? "New enquiries from the contact form land here." : "Try a different search."}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">From</TableHead>
              <TableHead className="hidden md:table-cell">Message</TableHead>
              <TableHead className="hidden w-36 lg:table-cell">Received</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelected(item)}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{initials(item.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden max-w-md md:table-cell">
                  <p className="truncate">
                    {item.subject && <span className="font-medium">{item.subject} </span>}
                    <span className="text-muted-foreground">{item.subject ? "— " : ""}{item.message}</span>
                  </p>
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell" title={new Date(item.created_at).toLocaleString()}>
                  {formatRelative(item.created_at)}
                </TableCell>
                <TableCell className="pr-4" onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${item.name}`}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onSelect={() => setSelected(item)}>
                        <Mail />
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={replyHref(item)}>
                          <Reply />
                          Reply
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => void addAsLead(item)}>
                        <UserPlus />
                        Add as lead
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={() => onRequestDelete(item)}>
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Sheet open={selected !== null} onOpenChange={(next) => !next && setSelected(null)}>
        <SheetContent className="w-full gap-0 p-0 sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader className="border-b px-6 py-4">
                <SheetTitle className="pr-6">{selected.subject || "Enquiry"}</SheetTitle>
                <SheetDescription>{new Date(selected.created_at).toLocaleString()}</SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback>{initials(selected.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium">{selected.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{selected.email}</p>
                  </div>
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-4" />
                    <a href={replyHref(selected)} className="truncate text-foreground hover:underline">
                      {selected.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4" />
                    {selected.phone ? (
                      <a href={`tel:${selected.phone}`} className="text-foreground hover:underline">
                        {selected.phone}
                      </a>
                    ) : (
                      <span>No phone</span>
                    )}
                  </div>
                </dl>
                <Separator />
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex justify-end gap-2 border-t bg-muted/30 px-6 py-3">
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    const item = selected;
                    setSelected(null);
                    onRequestDelete(item);
                  }}
                >
                  <Trash2 />
                  Delete
                </Button>
                <Button variant="outline" onClick={() => void addAsLead(selected)}>
                  <UserPlus />
                  Add as lead
                </Button>
                <Button asChild>
                  <a href={replyHref(selected)}>
                    <Reply />
                    Reply by email
                  </a>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
}
