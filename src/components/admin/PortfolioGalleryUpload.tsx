"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { portfolioGalleryUploadHint } from "@/lib/portfolio/cover";
import type { PortfolioGalleryImage } from "@/lib/types/database";

interface PortfolioGalleryUploadProps {
  images: PortfolioGalleryImage[];
  onChange: (images: PortfolioGalleryImage[]) => void;
}

export function PortfolioGalleryUpload({
  images,
  onChange,
}: PortfolioGalleryUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "portfolio");

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
        "Alt text for this gallery image (used for SEO and accessibility):",
        suggestedAlt,
      );

      if (alt === null) return;

      const trimmedAlt = alt.trim();
      if (!trimmedAlt) {
        setError("Alt text is required for gallery images.");
        return;
      }

      onChange([...images, { url: data.url, alt: trimmedAlt }]);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const next = [...images];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  }

  return (
    <div className="grid gap-3">
      {images.length > 0 ? (
        <ul className="grid gap-2">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`} className="flex items-center gap-3 rounded-lg border bg-card p-2">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized={image.url.endsWith(".svg")}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{image.alt}</p>
                <p className="truncate text-xs text-muted-foreground">{image.url}</p>
              </div>
              <div className="flex shrink-0 items-center">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label="Move image up">
                  <ArrowUp />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1} aria-label="Move image down">
                  <ArrowDown />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => removeImage(index)} aria-label="Remove image">
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">No gallery images yet.</p>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Shown in a bento grid on the project page. Use {portfolioGalleryUploadHint}.</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          {uploading ? "Uploading…" : "Add image"}
        </Button>
      </div>

      <input type="hidden" name="gallery_json" value={JSON.stringify(images)} />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
