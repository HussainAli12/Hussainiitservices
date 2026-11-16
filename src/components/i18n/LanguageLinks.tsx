/** Small "English / العربية / हिन्दी" switcher */
export function LanguageLinks({ links }: { links: { href: string; label: string; hrefLang: string }[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="mb-6 flex flex-wrap gap-2" aria-label="Languages">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            hrefLang={link.hrefLang}
            lang={link.hrefLang}
            className="inline-flex rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent/40 hover:text-accent"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
