"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Field, responseError } from "@/components/admin/kit";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { invalidate } from "@/lib/admin/admin-cache";
import { formatRelative } from "@/lib/admin/format";
import type { DbSiteStats } from "@/lib/types/database";

type StatKey = Exclude<keyof DbSiteStats, "id" | "updated_at">;

const GROUPS: { title: string; description: string; fields: { key: StatKey; label: string; suffix?: string }[] }[] = [
  {
    title: "Hero counters",
    description: "The four numbers in the homepage hero.",
    fields: [
      { key: "projects_delivered", label: "Projects delivered" },
      { key: "global_clients", label: "Global clients" },
      { key: "years_experience", label: "Years of experience" },
      { key: "client_satisfaction", label: "Client satisfaction", suffix: "%" },
    ],
  },
  {
    title: "Track record",
    description: "Numbers in the track-record section.",
    fields: [
      { key: "projects_completed", label: "Projects completed" },
      { key: "countries_served", label: "Countries served" },
      { key: "happy_clients", label: "Happy clients" },
    ],
  },
];

export function AdminStatsPanel({ stats, onSaved }: { stats: DbSiteStats; onSaved: () => Promise<void> }) {
  const [saving, setSaving] = useState(false);

  async function saveStats(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSaving(true);
    const payload = Object.fromEntries(GROUPS.flatMap((group) => group.fields).map((field) => [field.key, formData.get(field.key)]));

    try {
      const response = await fetch("/api/admin/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        toast.error(await responseError(response, "Failed to update site stats."));
        return;
      }
      toast.success("Site numbers saved", { description: "The live site refreshes in a moment." });
      invalidate("/api/admin/overview");
      await onSaved();
    } catch {
      toast.error("Failed to update site stats.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form key={stats.updated_at} onSubmit={saveStats} className="grid max-w-3xl gap-6">
      {GROUPS.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle>{group.title}</CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <Field key={field.key} label={field.label}>
                {(id) => (
                  <div className="relative">
                    <Input
                      id={id}
                      name={field.key}
                      type="number"
                      min={0}
                      max={field.suffix === "%" ? 100 : undefined}
                      required
                      defaultValue={Number(stats[field.key] ?? 0)}
                      className="tabular-nums"
                    />
                    {field.suffix && (
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                        {field.suffix}
                      </span>
                    )}
                  </div>
                )}
              </Field>
            ))}
          </CardContent>
        </Card>
      ))}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Last updated {formatRelative(stats.updated_at)}</p>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="animate-spin" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
