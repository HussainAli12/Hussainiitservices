"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { BookOpen, ExternalLink, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { PortfolioImageUpload } from "@/components/admin/PortfolioImageUpload";
import {
  EditorSheet,
  Field,
  FieldSection,
  PublishBadge,
  SearchInput,
  TableToolbar,
  responseError,
} from "@/components/admin/kit";
import { EmptyState } from "@/components/admin/shell/AdminPageHeader";
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
import { Label } from "@/components/admin/ui/label";
import { Switch } from "@/components/admin/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { Textarea } from "@/components/admin/ui/textarea";
import { invalidate } from "@/lib/admin/admin-cache";
import { formatDate } from "@/lib/admin/format";
import { blogCoverUploadHint } from "@/lib/blog/cover";
import { cn } from "@/lib/utils";
import type { DbBlog } from "@/lib/types/database";

type StatusFilter = "all" | "published" | "draft";

function keywordsToInput(keywords: string[] | null | undefined) {
  return keywords?.join(", ") ?? "";
}

export function AdminBlogPanel({
  blogs,
  onSaved,
  onRequestDelete,
}: {
  blogs: DbBlog[];
  onSaved: () => Promise<void>;
  onRequestDelete: (item: DbBlog) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DbBlog | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return blogs.filter((post) => {
      if (status === "published" && !post.is_published) return false;
      if (status === "draft" && post.is_published) return false;
      if (!needle) return true;
      return [post.title, post.slug, post.author, post.excerpt].some((value) => value?.toLowerCase().includes(needle));
    });
  }, [blogs, query, status]);

  const publishedCount = blogs.filter((post) => post.is_published).length;

  function openEditor(item: DbBlog | null) {
    setEditing(item);
    setCoverUrl(item?.cover_image_url || "");
    setContent(item?.content ?? "");
    setMetaDescription(item ? item.meta_description || item.excerpt || "" : "");
    setPublished(item?.is_published ?? true);
    setOpen(true);
  }

  async function saveBlog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) {
      toast.error("Write some Markdown content first.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    setSaving(true);

    const payload = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt") || null,
      content,
      author: formData.get("author") || "Hussaini IT Services",
      cover_image_url: coverUrl || null,
      cover_image_alt: formData.get("cover_image_alt") || null,
      meta_description: formData.get("meta_description") || null,
      meta_keywords: formData.get("meta_keywords") || "",
      is_published: published,
    };

    try {
      const response = await fetch("/api/admin/blogs", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      if (!response.ok) {
        toast.error(await responseError(response, "Failed to save blog post."));
        return;
      }
      toast.success(editing ? "Post updated" : "Post created");
      setOpen(false);
      invalidate("/api/admin/overview");
      await onSaved();
    } catch {
      toast.error("Failed to save blog post.");
    } finally {
      setSaving(false);
    }
  }

  const metaDescriptionLength = metaDescription.trim().length;
  const newButton = (
    <Button size="sm" onClick={() => openEditor(null)}>
      <Plus />
      New post
    </Button>
  );

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar end={newButton}>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <SearchInput value={query} onChange={setQuery} placeholder="Search posts" />
          <Tabs value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs">All {blogs.length}</TabsTrigger>
              <TabsTrigger value="published" className="text-xs">Published {publishedCount}</TabsTrigger>
              <TabsTrigger value="draft" className="text-xs">Drafts {blogs.length - publishedCount}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </TableToolbar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={blogs.length === 0 ? "No posts yet" : "No matches"}
          description={blogs.length === 0 ? "Write your first article to publish it on the blog." : "Try a different search or filter."}
          action={blogs.length === 0 ? newButton : undefined}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Post</TableHead>
              <TableHead className="hidden md:table-cell">Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Updated</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((post) => (
              <TableRow key={post.id} className="cursor-pointer" onClick={() => openEditor(post)}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    {post.cover_image_url ? (
                      <Image
                        width={112}
                        height={72}
                        sizes="56px"
                        src={post.cover_image_url}
                        alt=""
                        unoptimized={post.cover_image_url.endsWith(".svg")}
                        className="h-9 w-14 shrink-0 rounded-md border object-cover"
                      />
                    ) : (
                      <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                        <BookOpen className="size-4" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="max-w-md truncate font-medium">{post.title}</p>
                      <p className="truncate text-xs text-muted-foreground">/blog/{post.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{post.author || "—"}</TableCell>
                <TableCell>
                  <PublishBadge published={post.is_published} />
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">{formatDate(post.updated_at)}</TableCell>
                <TableCell className="pr-4" onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${post.title}`}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onSelect={() => openEditor(post)}>
                        <Pencil />
                        Edit
                      </DropdownMenuItem>
                      {post.is_published && (
                        <DropdownMenuItem asChild>
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                            <ExternalLink />
                            View live
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={() => onRequestDelete(post)}>
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
        title={editing ? "Edit post" : "New post"}
        description="Article, cover image, and search metadata."
        formKey={editing?.id ?? "new-blog"}
        onSubmit={saveBlog}
        saving={saving}
        submitLabel={editing ? "Save changes" : "Create post"}
      >
        <FieldSection title="Article">
          <Field label="Title">{(id) => <Input id={id} name="title" required defaultValue={editing?.title ?? ""} />}</Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="URL slug" hint="Leave blank to generate from the title.">
              {(id) => <Input id={id} name="slug" placeholder="my-post" defaultValue={editing?.slug ?? ""} />}
            </Field>
            <Field label="Author">
              {(id) => <Input id={id} name="author" defaultValue={editing?.author ?? "Hussaini IT Services"} />}
            </Field>
          </div>
          <Field label="Excerpt">
            {(id) => <Textarea id={id} name="excerpt" rows={2} placeholder="One or two sentences for cards." defaultValue={editing?.excerpt ?? ""} />}
          </Field>
          <MarkdownEditor value={content} onChange={setContent} uploadType="blog" label="Content" />
        </FieldSection>

        <FieldSection title="Cover">
          <PortfolioImageUpload
            label="Cover image"
            hint={`Used for the grid, featured slot, and article hero. Use ${blogCoverUploadHint}. Keep text and logos in the center 80%.`}
            type="screenshot"
            value={coverUrl}
            onChange={setCoverUrl}
          />
          <Field label="Cover alt text">
            {(id) => <Input id={id} name="cover_image_alt" placeholder="Describe the cover image" defaultValue={editing?.cover_image_alt ?? ""} />}
          </Field>
        </FieldSection>

        <FieldSection title="Search" description="How this post appears in Google and social previews.">
          <Field
            label="Meta description"
            hint={
              <span className={cn(metaDescriptionLength > 160 && "text-warning")}>
                {metaDescriptionLength} / 160 characters
              </span>
            }
          >
            {(id) => (
              <Textarea
                id={id}
                name="meta_description"
                rows={3}
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                placeholder="150–160 character summary."
              />
            )}
          </Field>
          <Field label="Keywords" hint="Comma separated.">
            {(id) => (
              <Input
                id={id}
                name="meta_keywords"
                placeholder="seo dubai, local seo, google business profile"
                defaultValue={keywordsToInput(editing?.meta_keywords)}
              />
            )}
          </Field>
        </FieldSection>

        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div>
            <Label htmlFor="blog-published">Published</Label>
            <p className="text-xs text-muted-foreground">Visible on the public blog.</p>
          </div>
          <Switch id="blog-published" checked={published} onCheckedChange={setPublished} />
        </div>
      </EditorSheet>
    </Card>
  );
}
