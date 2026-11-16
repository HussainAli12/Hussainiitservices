/**
 * Tiny stale-while-revalidate cache for admin API reads.
 *
 * Every admin page used to fetch on mount and show "Loading…" on each visit. Entries now live
 * in module memory for the whole session: a revisit renders the cached rows immediately and
 * refreshes in the background. Concurrent reads of the same path share one request.
 */

export interface CacheEntry<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
  updatedAt: number;
  pending: boolean;
}

const EMPTY: CacheEntry = { data: null, error: null, status: 0, updatedAt: 0, pending: false };

const entries = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CacheEntry>>();
const listeners = new Map<string, Set<() => void>>();

function emit(path: string) {
  listeners.get(path)?.forEach((listener) => listener());
}

function write(path: string, next: Partial<CacheEntry>) {
  entries.set(path, { ...(entries.get(path) ?? EMPTY), ...next });
  emit(path);
}

/** What the server rendered: nothing loaded. Used as the hydration snapshot. */
export function emptyEntry<T>(): CacheEntry<T> {
  return EMPTY as CacheEntry<T>;
}

export function readEntry<T>(path: string): CacheEntry<T> {
  return (entries.get(path) ?? EMPTY) as CacheEntry<T>;
}

export function subscribe(path: string, listener: () => void) {
  let set = listeners.get(path);
  if (!set) {
    set = new Set();
    listeners.set(path, set);
  }
  set.add(listener);
  return () => {
    set.delete(listener);
  };
}

/** Fetch `path` (deduplicated) and store the result. `url` lets a refresh hit a cache-busting variant. */
export function revalidate(path: string, url: string = path): Promise<CacheEntry> {
  const running = inflight.get(path);
  if (running) return running;

  write(path, { pending: true });

  const request = (async () => {
    try {
      const response = await fetch(url, { cache: "no-store" });
      let body: { data?: unknown; error?: string } = {};
      try {
        body = await response.json();
      } catch {
        body = {};
      }

      if (response.ok) {
        write(path, { data: body.data ?? null, error: null, status: response.status, updatedAt: Date.now() });
      } else {
        // Keep the last good data on screen; surface the error alongside it.
        write(path, { error: body.error || "Request failed.", status: response.status, updatedAt: Date.now() });
      }
    } catch {
      write(path, { error: "Could not connect to the admin API.", status: 0, updatedAt: Date.now() });
    } finally {
      inflight.delete(path);
      write(path, { pending: false });
    }
    return readEntry(path);
  })();

  inflight.set(path, request);
  return request;
}

/** Warm the cache unless a fresh copy already exists. */
export function prefetch(path: string, maxAgeMs = 30_000) {
  const entry = readEntry(path);
  if (entry.pending) return;
  if (entry.updatedAt && Date.now() - entry.updatedAt < maxAgeMs) return;
  void revalidate(path);
}

/** Replace cached data locally (optimistic updates). */
export function setCached<T>(path: string, updater: (current: T | null) => T | null) {
  write(path, { data: updater(readEntry<T>(path).data) });
}

/** Mark entries as stale so the next visit refetches (e.g. after a mutation elsewhere). */
export function invalidate(...paths: string[]) {
  for (const path of paths) {
    const entry = entries.get(path);
    if (entry) entries.set(path, { ...entry, updatedAt: 0 });
  }
}

/**
 * After a write, refresh every cached path under `prefix`: views on screen refetch now,
 * the rest refetch on their next visit.
 */
export function refreshPrefix(prefix: string) {
  for (const path of entries.keys()) {
    if (!path.startsWith(prefix)) continue;
    if (listeners.get(path)?.size) void revalidate(path);
    else invalidate(path);
  }
}
