"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { Briefcase, ExternalLink, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { PortfolioGalleryUpload } from "@/components/admin/PortfolioGalleryUpload";
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
import { Badge } from "@/components/admin/ui/badge";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Switch } from "@/components/admin/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { Textarea } from "@/components/admin/ui/textarea";
import { invalidate } from "@/lib/admin/admin-cache";
import { clientLogoUploadHint, portfolioCoverUploadHint } from "@/lib/portfolio/cover";
import { cn } from "@/lib/utils";
import type { DbPortfolio, PortfolioCoverType, PortfolioGalleryImage } from "@/lib/types/database";

function keywordsToInput(keywords: string[] | null | undefined) {
  return keywords?.join(", ") ?? "";
}

function parseCommaList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function coverSrc(project: DbPortfolio) {
  if (project.cover_type === "logo" && project.logo_url) return project.logo_url;
  return project.image_url || project.logo_url || "";
}

export function AdminPortfolioPanel({
  portfolio,
  onSaved,
  onRequestDelete,
}: {
  portfolio: DbPortfolio[];
  onSaved: () => Promise<void>;
  onRequestDelete: (item: DbPortfolio) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DbPortfolio | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [coverType, setCoverType] = useState<PortfolioCoverType>("screenshot");
  const [content, setContent] = useState("");
  const [gallery, setGallery] = useState<PortfolioGalleryImage[]>([]);
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(portfolio.map((project) => project.category).filter(Boolean))).sort(),
    [portfolio],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return portfolio.filter((project) => {
      if (category !== "all" && project.category !== category) return false;
      if (!needle) return true;
      return [project.title, project.client_name, project.category, project.slug].some((value) =>
        value?.toLowerCase().includes(needle),
      );
    });
  }, [portfolio, query, category]);

  function openEditor(item: DbPortfolio | null) {
    setEditing(item);
    setLogoUrl(item?.logo_url || "");
    setScreenshotUrl(item?.image_url || "");
    setCoverType(item?.cover_type === "logo" ? "logo" : "screenshot");
    setContent(item?.content || "");
    setGallery(item?.gallery || []);
    setMetaDescription(item ? item.meta_description || item.description || "" : "");
    setPublished(item?.is_published ?? true);
    setOpen(true);
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSaving(true);

    const payload = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      category: formData.get("category"),
      client_name: formData.get("client_name") || null,
      description: formData.get("description"),
      challenge: formData.get("challenge") || null,
      solution: formData.get("solution") || null,
      results: formData.get("results") || null,
      highlights: parseCommaList(formData.get("highlights")),
      tags: parseCommaList(formData.get("tags")),
      tech_stack: parseCommaList(formData.get("tech_stack")),
      content,
      gallery,
      logo_url: logoUrl || null,
      image_url: screenshotUrl || null,
      cover_type: coverType,
      cover_image_alt: formData.get("cover_image_alt") || null,
      meta_description: formData.get("meta_description") || null,
      meta_keywords: formData.get("meta_keywords") || "",
      project_url: formData.get("project_url") || null,
      is_published: published,
      sort_order: Number(formData.get("sort_order")) || 0,
    };

    try {
      const response = await fetch("/api/admin/portfolio", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      if (!response.ok) {
        toast.error(await responseError(response, "Failed to save portfolio project."));
        return;
      }
      toast.success(editing ? "Project updated" : "Project created");
      setOpen(false);
      invalidate("/api/admin/overview");
      await onSaved();
    } catch {
      toast.error("Failed to save portfolio project.");
    } finally {
      setSaving(false);
    }
  }

  const metaDescriptionLength = metaDescription.trim().length;
  const newButton = (
    <Button size="sm" onClick={() => openEditor(null)}>
      <Plus />
      New project
    </Button>
  );

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <TableToolbar end={newButton}>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <SearchInput value={query} onChange={setQuery} placeholder="Search projects" />
          {categories.length > 1 && (
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger size="sm" className="w-44 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </TableToolbar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={portfolio.length === 0 ? "No projects yet" : "No matches"}
          description={portfolio.length === 0 ? "Add a client project to build out the portfolio." : "Try a different search or category."}
          action={portfolio.length === 0 ? newButton : undefined}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Project</TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden w-16 text-right lg:table-cell">Order</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((project) => {
              const thumb = coverSrc(project);
              return (
                <TableRow key={project.id} className="cursor-pointer" onClick={() => openEditor(project)}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      {thumb ? (
                        <Image
                          width={112}
                          height={72}
                          sizes="56px"
                          src={thumb}
                          alt=""
                          unoptimized={thumb.endsWith(".svg")}
                          className={cn(
                            "h-9 w-14 shrink-0 rounded-md border bg-white",
                            project.cover_type === "logo" ? "object-contain p-1" : "object-cover",
                          )}
                        />
                      ) : (
                        <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                          <Briefcase className="size-4" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="max-w-sm truncate font-medium">{project.title}</p>
                        <p className="truncate text-xs text-muted-foreground">/portfolio/{project.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{project.client_name || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className="font-normal">
                      {project.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <PublishBadge published={project.is_published} />
                  </TableCell>
                  <TableCell className="hidden text-right text-muted-foreground tabular-nums lg:table-cell">
                    {project.sort_order}
                  </TableCell>
                  <TableCell className="pr-4" onClick={(event) => event.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${project.title}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onSelect={() => openEditor(project)}>
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                        {project.is_published && (
                          <DropdownMenuItem asChild>
                            <a href={`/portfolio/${project.slug}`} target="_blank" rel="noreferrer">
                              <ExternalLink />
                              View live
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => onRequestDelete(project)}>
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <EditorSheet
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit project" : "New project"}
        description="Case study, images, and search metadata for this client."
        formKey={editing?.id ?? "new-portfolio"}
        onSubmit={saveProject}
        saving={saving}
        submitLabel={editing ? "Save changes" : "Create project"}
      >
        <FieldSection title="Project">
          <Field label="Title">{(id) => <Input id={id} name="title" required defaultValue={editing?.title ?? ""} />}</Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="URL slug" hint="Leave blank to generate from the title.">
              {(id) => <Input id={id} name="slug" defaultValue={editing?.slug ?? ""} />}
            </Field>
            <Field label="Category">
              {(id) => (
                <>
                  <Input id={id} name="category" required list="portfolio-categories" defaultValue={editing?.category ?? ""} />
                  <datalist id="portfolio-categories">
                    {categories.map((value) => (
                      <option key={value} value={value} />
                    ))}
                  </datalist>
                </>
              )}
            </Field>
            <Field label="Client">
              {(id) => <Input id={id} name="client_name" defaultValue={editing?.client_name ?? ""} />}
            </Field>
            <Field label="Live website">
              {(id) => <Input id={id} name="project_url" type="url" placeholder="https://" defaultValue={editing?.project_url ?? ""} />}
            </Field>
          </div>
          <Field label="Summary" hint="Short description for portfolio cards.">
            {(id) => <Textarea id={id} name="description" required rows={3} defaultValue={editing?.description ?? ""} />}
          </Field>
        </FieldSection>

        <FieldSection title="Case study">
          <Field label="Challenge">
            {(id) => <Textarea id={id} name="challenge" rows={3} defaultValue={editing?.challenge ?? ""} />}
          </Field>
          <Field label="Solution">
            {(id) => <Textarea id={id} name="solution" rows={3} defaultValue={editing?.solution ?? ""} />}
          </Field>
          <Field label="Results">
            {(id) => <Textarea id={id} name="results" rows={3} defaultValue={editing?.results ?? ""} />}
          </Field>
          <Field label="Tech stack" hint="Comma separated.">
            {(id) => <Input id={id} name="tech_stack" defaultValue={editing?.tech_stack?.join(", ") ?? ""} />}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Key deliverables" hint="Comma separated.">
              {(id) => <Input id={id} name="highlights" defaultValue={editing?.highlights?.join(", ") ?? ""} />}
            </Field>
            <Field label="Tags" hint="Comma separated.">
              {(id) => <Input id={id} name="tags" defaultValue={editing?.tags?.join(", ") ?? ""} />}
            </Field>
          </div>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            uploadType="portfolio"
            label="Extended content"
            placeholder="## Project overview"
            hint="Optional long-form Markdown shown below the case study."
          />
        </FieldSection>

        <FieldSection title="Images">
          <PortfolioImageUpload
            label="Client logo"
            hint={`Homepage icon. Use ${clientLogoUploadHint}`}
            type="logo"
            value={logoUrl}
            onChange={setLogoUrl}
          />
          <PortfolioImageUpload
            label="Cover image"
            hint={`Hero and card cover. Use ${portfolioCoverUploadHint}. Keep key visuals in the center 80%.`}
            type="screenshot"
            value={screenshotUrl}
            onChange={setScreenshotUrl}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Card shows">
              {(id) => (
                <Select value={coverType} onValueChange={(value) => setCoverType(value === "logo" ? "logo" : "screenshot")}>
                  <SelectTrigger id={id} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screenshot">Cover image</SelectItem>
                    <SelectItem value="logo">Client logo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Field>
            <Field label="Cover alt text">
              {(id) => <Input id={id} name="cover_image_alt" defaultValue={editing?.cover_image_alt ?? ""} />}
            </Field>
          </div>
          <div className="grid gap-2">
            <Label>Gallery</Label>
            <PortfolioGalleryUpload images={gallery} onChange={setGallery} />
          </div>
        </FieldSection>

        <FieldSection title="Search" description="How this project appears in Google and social previews.">
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
            {(id) => <Input id={id} name="meta_keywords" defaultValue={keywordsToInput(editing?.meta_keywords)} />}
          </Field>
        </FieldSection>

        <FieldSection title="Publishing">
          <div className="grid gap-4 sm:grid-cols-[1fr_8rem] sm:items-end">
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <Label htmlFor="portfolio-published">Published</Label>
                <p className="text-xs text-muted-foreground">Visible on the public portfolio.</p>
              </div>
              <Switch id="portfolio-published" checked={published} onCheckedChange={setPublished} />
            </div>
            <Field label="Sort order">
              {(id) => <Input id={id} name="sort_order" type="number" min={0} defaultValue={editing?.sort_order ?? 0} />}
            </Field>
          </div>
        </FieldSection>
      </EditorSheet>
    </Card>
  );
}
