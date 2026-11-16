"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { responseError } from "@/components/admin/kit";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin/ui/alert-dialog";
import { invalidate } from "@/lib/admin/admin-cache";

interface DeleteTarget {
  endpoint: string;
  id: string;
  label: string;
  title: string;
}

/**
 * Confirm-then-delete. `onDeleted` receives the id so callers can drop the row from the cache
 * immediately instead of waiting for a refetch.
 */
export function useAdminDelete(onDeleted: (id: string) => void) {
  const [target, setTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirm() {
    if (!target) return;
    setDeleting(true);

    try {
      const response = await fetch(target.endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: target.id }),
      });

      if (!response.ok) {
        toast.error(await responseError(response, "Failed to delete item."));
        return;
      }

      onDeleted(target.id);
      invalidate("/api/admin/overview");
      toast.success(`Deleted "${target.label}"`);
      setTarget(null);
    } catch {
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const dialog = (
    <AlertDialog open={Boolean(target)} onOpenChange={(open) => !open && !deleting && setTarget(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{target?.title ?? "Delete?"}</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{target?.label}&rdquo; will be permanently deleted. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={deleting}
            onClick={(event) => {
              event.preventDefault();
              void confirm();
            }}
          >
            {deleting && <Loader2 className="animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { request: setTarget, dialog };
}
