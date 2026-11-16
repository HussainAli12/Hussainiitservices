import { cn } from "@/lib/utils";

/**
 * Purely decorative text (watermark step numbers, quote marks, brand flourishes).
 * Rendered via ::before content so it looks identical but is not a text node — screen readers
 * skip it and contrast audits don't treat a 7%-opacity watermark as unreadable body copy.
 */
export function DecorativeText({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "div" | "p";
}) {
  return <Tag aria-hidden data-text={text} className={cn("before:content-[attr(data-text)]", className)} />;
}
