/** Thin route transition indicator — not a blocking splash. */
export default function Loading() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 origin-left animate-pulse bg-accent"
      role="status"
      aria-label="Loading page"
    />
  );
}
