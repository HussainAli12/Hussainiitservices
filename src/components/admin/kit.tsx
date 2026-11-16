"use client";

import { useId, type FormEvent, type ReactNode } from "react";
import { Loader2, Search } from "lucide-react";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/admin/ui/sheet";
import { cn } from "@/lib/utils";

/** Label + control + hint, wired by id. Pass a render function to receive the id. */
export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: ReactNode;
  className?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children(id)}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** A titled group of fields inside an editor. */
export function FieldSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 border-t pt-6 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-8 pl-8 shadow-none"
        aria-label={placeholder}
      />
    </div>
  );
}

/** Search on the left, counts/actions on the right — sits at the top of a table card. */
export function TableToolbar({ children, end }: { children: ReactNode; end?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
      {children}
      {end && <div className="flex items-center gap-2">{end}</div>}
    </div>
  );
}

export function PublishBadge({ published }: { published: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-normal",
        published ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full", published ? "bg-success" : "bg-warning")} />
      {published ? "Published" : "Draft"}
    </Badge>
  );
}

/** Right-hand drawer with a scrolling form body and a pinned footer. */
export function EditorSheet({
  open,
  onOpenChange,
  title,
  description,
  formKey,
  onSubmit,
  saving,
  submitLabel,
  size = "lg",
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  formKey: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  submitLabel: string;
  size?: "md" | "lg";
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn("w-full gap-0 p-0", size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg")}
        onInteractOutside={(event) => saving && event.preventDefault()}
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <form key={formKey} onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="grid flex-1 content-start gap-6 overflow-y-auto px-6 py-6">{children}</div>
          <SheetFooter className="flex-row justify-end border-t bg-muted/30 px-6 py-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              {submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

/** Read a JSON error body without throwing on empty responses. */
export async function responseError(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return (data?.error as string) || fallback;
  } catch {
    return fallback;
  }
}
