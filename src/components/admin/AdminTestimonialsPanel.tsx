"use client";

import { useMemo, useState, type FormEvent } from "react";
import { MoreHorizontal, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PortfolioImageUpload } from "@/components/admin/PortfolioImageUpload";
import { EditorSheet, Field, FieldSection, SearchInput, TableToolbar, responseError } from "@/components/admin/kit";
import { EmptyState } from "@/components/admin/shell/AdminPageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { Textarea } from "@/components/admin/ui/textarea";
import { invalidate } from "@/lib/admin/admin-cache";
import { initials } from "@/lib/admin/format";
import type { DbTestimonial } from "@/lib/types/database";

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={index < value ? "size-3.5 fill-amber-400 text-amber-400" : "size-3.5 text-border"}
        />
      ))}
    </span>
  );
}

export function AdminTestimonialsPanel({
  items,
  onSaved,
  onRequestDelete,
}: {
  items: DbTestimonial[];
  onSaved: () => Promise<void>;
  onRequestDelete: (item: DbTestimonial) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DbTestimonial | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [rating, setRating] = useState("5");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.name, item.company, item.role, item.location, item.quote].some((value) =>
        value?.toLowerCase().includes(needle),
      ),
    );
  }, [items, query]);

  function openEditor(item: DbTestimonial | null) {
    setEditing(item);
    setLogoUrl(item?.logo_url || "");
    setRating(String(item?.rating ?? 5));
    setOpen(true);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSaving(true);
    const payload = {
      name: formData.get("name"),
      role: formData.get("role"),
      company: formData.get("company"),
      quote: formData.get("quote"),
      rating: Number(rating) || 5,
      website_url: formData.get("website_url") || null,
      location: formData.get("location") || null,
      logo_url: logoUrl || null,
    };

    try {
      const response = await fetch("/api/admin/testimonials", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      if (!response.ok) {
        toast.error(await responseError(response, "Failed to save testimonial."));
        return;
      }
      toast.success(editing ? "Testimonial updated" : "Testimonial created");
      setOpen(false);
      invalidate("/api/admin/overview");
      await onSaved();
    } catch {
      toast.error("Failed to save testimonial.");
    } finally {
      setSaving(false);
    }
  }

  const newButton = (
    <Button size="sm" onClick={() => openEditor(null)}>
      <Plus />
      New testimonial
    </Button>
  );

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar end={newButton}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search testimonials" />
      </TableToolbar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Star}
          title={items.length === 0 ? "No testimonials yet" : "No matches"}
          description={items.length === 0 ? "Add a client quote to show it on the website." : "Try a different search."}
          action={items.length === 0 ? newButton : undefined}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Client</TableHead>
              <TableHead className="hidden md:table-cell">Company</TableHead>
              <TableHead className="hidden lg:table-cell">Quote</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="cursor-pointer" onClick={() => openEditor(item)}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 rounded-md border bg-white">
                      {item.logo_url && <AvatarImage src={item.logo_url} alt="" className="object-contain p-1" />}
                      <AvatarFallback className="rounded-md text-xs">{initials(item.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <p>{item.company}</p>
                  {item.location && <p className="text-xs text-muted-foreground">{item.location}</p>}
                </TableCell>
                <TableCell className="hidden max-w-sm truncate text-muted-foreground lg:table-cell">
                  {item.quote}
                </TableCell>
                <TableCell>
                  <Rating value={item.rating} />
                </TableCell>
                <TableCell className="pr-4" onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${item.name}`}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onSelect={() => openEditor(item)}>
                        <Pencil />
                        Edit
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

      <EditorSheet
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit testimonial" : "New testimonial"}
        description="Shown on the testimonials page and the homepage."
        formKey={editing?.id ?? "new"}
        onSubmit={save}
        saving={saving}
        submitLabel={editing ? "Save changes" : "Create testimonial"}
        size="md"
      >
        <FieldSection title="Client">
          <Field label="Name">{(id) => <Input id={id} name="name" required defaultValue={editing?.name ?? ""} />}</Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role">{(id) => <Input id={id} name="role" required defaultValue={editing?.role ?? ""} />}</Field>
            <Field label="Company">
              {(id) => <Input id={id} name="company" required defaultValue={editing?.company ?? ""} />}
            </Field>
            <Field label="Website">
              {(id) => <Input id={id} name="website_url" type="url" placeholder="https://" defaultValue={editing?.website_url ?? ""} />}
            </Field>
            <Field label="Location">
              {(id) => <Input id={id} name="location" placeholder="Dubai, UAE" defaultValue={editing?.location ?? ""} />}
            </Field>
          </div>
        </FieldSection>
        <FieldSection title="Testimonial">
          <Field label="Quote">
            {(id) => <Textarea id={id} name="quote" required rows={5} defaultValue={editing?.quote ?? ""} />}
          </Field>
          <Field label="Rating" className="max-w-40">
            {(id) => (
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger id={id} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value} star{value === 1 ? "" : "s"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>
          <PortfolioImageUpload
            label="Client logo"
            hint="Optional logo shown beside the company name."
            type="logo"
            value={logoUrl}
            onChange={setLogoUrl}
          />
        </FieldSection>
      </EditorSheet>
    </Card>
  );
}
