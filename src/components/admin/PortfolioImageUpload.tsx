"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { clientLogoAspectClass } from "@/lib/portfolio/cover";
import { cn } from "@/lib/utils";

interface PortfolioImageUploadProps {
  label: string;
  hint: string;
  type: "logo" | "screenshot";
  value: string;
  onChange: (url: string) => void;
}

export function PortfolioImageUpload({ label, hint, type, value, onChange }: PortfolioImageUploadProps) {
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
    formData.append("type", type);

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

      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>

      {value ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border bg-muted/40",
            type === "logo" ? cn("w-full max-w-xs", clientLogoAspectClass) : "h-36 w-full",
          )}
        >
          <Image
            src={value}
            alt={`${label} preview`}
            fill
            sizes="400px"
            className={type === "logo" ? "object-contain p-2" : "object-cover"}
            unoptimized={value.endsWith(".svg")}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-xs"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 rounded-full shadow-sm"
            aria-label={`Remove ${label}`}
          >
            <X />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex h-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground transition-colors hover:bg-muted/60 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploading ? "Uploading…" : "Click to upload"}
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2">
        <Input type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Or paste an image URL" />
        {value && (
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
            Replace
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{hint}</p>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
