"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { Button } from "@/components/admin/ui/button";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  uploadType?: "blog" | "portfolio";
  label?: string;
  placeholder?: string;
  hint?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  uploadType = "blog",
  label = "Content (Markdown / README)",
  placeholder = "## Heading\n\nWrite in Markdown.\n\n- Point one\n- Point two\n\n![Optional image](url)",
  hint = "Write like a README: headings, lists, links, bold, code, tables. Place the cursor where the image should go, then click Insert image.",
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  function insertAtCursor(snippet: string) {
    const field = textareaRef.current;
    if (!field) {
      onChange(`${value.trimEnd()}\n\n${snippet}\n`);
      return;
    }

    const start = field.selectionStart;
    const end = field.selectionEnd;
    const next = `${value.slice(0, start)}${snippet}${value.slice(end)}`;
    onChange(next);

    requestAnimationFrame(() => {
      const cursor = start + snippet.length;
      field.focus();
      field.setSelectionRange(cursor, cursor);
    });
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", uploadType);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      const suggestedAlt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      const alt = window.prompt(
        "Alt text for this image (used for SEO and accessibility):",
        suggestedAlt,
      );

      if (alt === null) return;

      const trimmedAlt = alt.trim();
      if (!trimmedAlt) {
        setError("Alt text is required for inline images.");
        return;
      }

      insertAtCursor(`\n\n![${trimmedAlt}](${data.url})\n\n`);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-0.5">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button type="button" variant="ghost" size="xs" onClick={() => fileRef.current?.click()} disabled={uploading || preview}>
            {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
            {uploading ? "Uploading…" : "Image"}
          </Button>
          <Button type="button" variant={preview ? "ghost" : "secondary"} size="xs" onClick={() => setPreview(false)} className={preview ? "" : "bg-background shadow-xs"}>
            Write
          </Button>
          <Button type="button" variant={preview ? "secondary" : "ghost"} size="xs" onClick={() => setPreview(true)} className={preview ? "bg-background shadow-xs" : ""}>
            Preview
          </Button>
        </div>
      </div>

      {preview ? (
        <div className="admin-site-preview min-h-64 rounded-lg border bg-white px-5 py-6">
          {value.trim() ? (
            <BlogMarkdown content={value} />
          ) : (
            <p className="text-sm text-muted">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          name="content"
          rows={18}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-80 font-mono text-[13px] leading-6"
        />
      )}

      <p className="text-xs text-muted-foreground">{hint}</p>
      {preview ? <input type="hidden" name="content" value={value} /> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
