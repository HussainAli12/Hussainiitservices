import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogMarkdownProps {
  content: string;
}

function isHttpUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

export function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <div className="blog-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }: { children?: ReactNode }) => <h2>{children}</h2>,
          a: ({ href, children }: { href?: string; children?: ReactNode }) => {
            const external = href ? isHttpUrl(href) : false;
            return (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }: { src?: string | Blob; alt?: string }) => {
            if (!src || typeof src !== "string") return null;
            const caption = alt?.trim();

            return (
              <figure className="blog-figure">
                {/* eslint-disable-next-line @next/next/no-img-element -- CMS markdown images have unknown dimensions */}
                <img src={src} alt={caption || ""} loading="lazy" decoding="async" className="blog-image" />
                {caption ? <figcaption>{caption}</figcaption> : null}
              </figure>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
