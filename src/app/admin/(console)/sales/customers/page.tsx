"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Users } from "lucide-react";
import { CRM } from "@/components/admin/crm/api";
import { CustomerSheet } from "@/components/admin/crm/editors";
import { ChannelIcon, DueLabel, LifecycleBadge } from "@/components/admin/crm/parts";
import { SearchInput, TableToolbar } from "@/components/admin/kit";
import { AdminError, AdminPageHeader, EmptyState, TableSkeleton } from "@/components/admin/shell/AdminPageHeader";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { useAdminResource } from "@/components/admin/use-admin-resource";
import { formatRelative } from "@/lib/admin/format";
import { channelLabel, formatInr } from "@/lib/crm/config";
import type { CrmCustomerRow, Lifecycle } from "@/lib/crm/types";

type Filter = "all" | Lifecycle;

export default function CustomersPage() {
  const router = useRouter();
  const resource = useAdminResource<CrmCustomerRow[]>(CRM.customers);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [creating, setCreating] = useState(false);

  const customers = useMemo(() => resource.data ?? [], [resource.data]);
  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: customers.length, lead: 0, client: 0, inactive: 0 };
    for (const customer of customers) result[customer.lifecycle] += 1;
    return result;
  }, [customers]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return customers.filter((customer) => {
      if (filter !== "all" && customer.lifecycle !== filter) return false;
      if (!needle) return true;
      return [
        customer.name,
        customer.city,
        customer.industry,
        customer.primary_contact?.name,
        customer.primary_contact?.phone,
        customer.primary_contact?.email,
      ].some((value) => value?.toLowerCase().includes(needle));
    });
  }, [customers, query, filter]);

  const newButton = (
    <Button size="sm" onClick={() => setCreating(true)}>
      <Plus />
      New customer
    </Button>
  );

  return (
    <>
      <AdminPageHeader
        title="Customers"
        description="Leads and clients, with their last conversation and next step."
        onRefresh={resource.reload}
        refreshing={resource.refreshing}
      />
      <AdminError message={resource.error} />

      {resource.loading ? (
        <TableSkeleton />
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <TableToolbar end={newButton}>
            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
              <SearchInput value={query} onChange={setQuery} placeholder="Search name, phone, city" />
              <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs">All {counts.all}</TabsTrigger>
                  <TabsTrigger value="lead" className="text-xs">Leads {counts.lead}</TabsTrigger>
                  <TabsTrigger value="client" className="text-xs">Clients {counts.client}</TabsTrigger>
                  <TabsTrigger value="inactive" className="text-xs">Inactive {counts.inactive}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </TableToolbar>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title={customers.length === 0 ? "No customers yet" : "No matches"}
              description={
                customers.length === 0
                  ? "Add your first lead, or convert a website enquiry from My day."
                  : "Try a different search or filter."
              }
              action={customers.length === 0 ? newButton : undefined}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden xl:table-cell">Open deals</TableHead>
                  <TableHead>Last contact</TableHead>
                  <TableHead className="hidden pr-4 lg:table-cell">Next step</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((customer) => {
                  const last = customer.last_activity;
                  const href = `/admin/sales/customers/${customer.id}`;
                  return (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer"
                      onClick={() => router.push(href)}
                      onMouseEnter={() => router.prefetch(href)}
                    >
                      <TableCell className="pl-4">
                        <Link href={href} className="block min-w-0" onClick={(event) => event.stopPropagation()}>
                          <span className="flex items-center gap-2">
                            <span className="max-w-56 truncate font-medium">{customer.name}</span>
                            <LifecycleBadge lifecycle={customer.lifecycle} />
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {[customer.industry, customer.city].filter(Boolean).join(" · ") || "—"}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {customer.primary_contact ? (
                          <>
                            <p className="max-w-44 truncate">{customer.primary_contact.name}</p>
                            <p className="text-xs text-muted-foreground tabular-nums">
                              {customer.primary_contact.phone || customer.primary_contact.email || "—"}
                            </p>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {customer.open_deals > 0 ? (
                          <>
                            <p className="tabular-nums">{formatInr(customer.open_value)}</p>
                            <p className="text-xs text-muted-foreground">
                              {customer.open_deals} deal{customer.open_deals === 1 ? "" : "s"}
                            </p>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {last ? (
                          <div className="flex max-w-xs items-center gap-2.5">
                            <ChannelIcon channel={last.channel} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate text-sm">
                                {last.outcome || channelLabel(last.channel)}
                                {last.summary && <span className="text-muted-foreground"> — {last.summary}</span>}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatRelative(last.occurred_at)}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not contacted yet</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden pr-4 lg:table-cell">
                        {customer.next_task ? (
                          <>
                            <p className="max-w-48 truncate text-sm">{customer.next_task.title}</p>
                            <DueLabel dueAt={customer.next_task.due_at} />
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      <CustomerSheet open={creating} onOpenChange={setCreating} />
    </>
  );
}
