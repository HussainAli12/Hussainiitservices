import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlogCoverImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function BlogCoverImage({ src, alt, sizes, priority, className }: BlogCoverImageProps) {
  const isSvg = src.endsWith(".svg");

  return (
    <div className={cn("relative overflow-hidden bg-surface", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-center"
        unoptimized={isSvg}
      />
    </div>
  );
}
