"use client";

import { History, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/ui/page-header";
import { formatDateTime, formatRelative } from "@/lib/format";
import { categoryOf, EMPTY_AUDIT_FILTER, filterAuditLog, humanizeAction, type AuditCategory } from "@/lib/selectors/audit-log";
import { useAppStore } from "@/lib/store/app-store";
import type { AuditLogEntry } from "@/lib/types/audit-log";
import type { Column } from "@/lib/types/table";

const CATEGORIES: AuditCategory[] = ["Students", "Staff & permissions", "Health camps", "Medical records", "Consent", "hfiles.in", "Settings", "Other"];

const columns: Column<AuditLogEntry>[] = [
  {
    id: "when",
    header: "When",
    cell: (e) => (
      <time dateTime={e.timestamp} title={formatDateTime(e.timestamp)} className="flex flex-col">
        <span className="text-ink">{formatRelative(e.timestamp)}</span>
        <span className="text-[13px] text-ink-faint">{formatDateTime(e.timestamp)}</span>
      </time>
    ),
  },
  { id: "actor", header: "Actor", cell: (e) => <span className="font-medium text-ink">{e.actor}</span> },
  { id: "action", header: "Action", cell: (e) => <span className="text-ink-soft">{humanizeAction(e.action)}</span> },
  { id: "target", header: "Target", className: "whitespace-normal", cell: (e) => e.target },
  { id: "reason", header: "Reason for change", className: "whitespace-normal min-w-56", cell: (e) => (e.reason ? e.reason : <span className="text-ink-faint">—</span>) },
];

export function AuditLogView() {
  const entries = useAppStore((s) => s.auditLog);
  const [filter, setFilter] = useState(EMPTY_AUDIT_FILTER);
  const rows = useMemo(() => filterAuditLog(entries, filter), [entries, filter]);
  const counts = useMemo(() => {
    const c = new Map<string, number>();
    entries.forEach((e) => c.set(categoryOf(e.action), (c.get(categoryOf(e.action)) ?? 0) + 1));
    return c;
  }, [entries]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Audit log" description={`${entries.length} changes recorded since the school started using HealthConnect.`} />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <label htmlFor="audit-search" className="sr-only">Search the audit log</label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
          <input
            id="audit-search"
            type="search"
            value={filter.query}
            onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
            placeholder="Actor, action, target or reason"
            className="h-10 w-full rounded-lg border border-input bg-canvas pr-3 pl-9 text-sm text-ink outline-none placeholder:text-ink-faint focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
        <NativeSelect
          aria-label="Category"
          value={filter.category}
          onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value as AuditCategory | "" }))}
          placeholder="All categories"
          options={CATEGORIES.filter((c) => counts.get(c)).map((c) => ({ value: c, label: `${c} (${counts.get(c)})` }))}
          className="lg:w-56"
        />
        {(filter.query || filter.category) && (
          <button type="button" onClick={() => setFilter(EMPTY_AUDIT_FILTER)} className="text-sm font-medium text-ink-soft hover:text-ink">
            Clear filters
          </button>
        )}
      </div>
      <p className="text-sm text-ink-soft" aria-live="polite">Showing {rows.length} of {entries.length} entries</p>
      <DataTable
        caption="Audit log"
        columns={columns}
        rows={rows}
        getRowId={(e) => e.id}
        scrollClassName="max-h-[calc(100dvh-360px)] min-h-72"
        empty={<EmptyState icon={History} title="No entries match" description="Try clearing a filter." />}
      />
    </div>
  );
}
