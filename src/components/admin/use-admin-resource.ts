"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { emptyEntry, invalidate, prefetch, readEntry, revalidate, setCached, subscribe } from "@/lib/admin/admin-cache";

/**
 * Read an admin API resource through the shared session cache.
 *
 * `loading` is only true when nothing has loaded yet; background refreshes set `refreshing`
 * so tables never flash back to a skeleton.
 */
export function useAdminResource<T>(path: string | null, { maxAgeMs = 30_000 }: { maxAgeMs?: number } = {}) {
  const router = useRouter();
  const entry = useSyncExternalStore(
    (listener) => (path ? subscribe(path, listener) : () => {}),
    () => (path ? readEntry<T>(path) : emptyEntry<T>()),
    // Hydrate against what the server rendered (no data), then switch to the live cache.
    emptyEntry<T>,
  );

  useEffect(() => {
    if (path) prefetch(path, maxAgeMs);
  }, [path, maxAgeMs]);

  useEffect(() => {
    if (entry.status === 401) router.replace("/admin/login");
  }, [entry.status, router]);

  const reload = useCallback(async () => {
    if (path) await revalidate(path);
  }, [path]);

  /** Force a server-side refresh for endpoints that cache upstream data (e.g. Google insights). */
  const refresh = useCallback(async () => {
    if (path) await revalidate(path, `${path}${path.includes("?") ? "&" : "?"}fresh=1`);
  }, [path]);

  const mutate = useCallback(
    (updater: (current: T | null) => T | null) => {
      if (path) setCached<T>(path, updater);
    },
    [path],
  );

  return {
    data: entry.data,
    error: entry.error,
    loading: path !== null && entry.data === null && entry.updatedAt === 0,
    refreshing: entry.pending,
    reload,
    refresh,
    mutate,
  };
}

export { invalidate, prefetch };
