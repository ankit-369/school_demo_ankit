"use client";

import { Search } from "lucide-react";
import { ArchiveToggle } from "@/components/ui/archive-toggle";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { REPORT_CATEGORY_LABELS } from "@/lib/labels";
import { EMPTY_REPORTS_FILTER, type ReportsFilter } from "@/lib/selectors/reports";

type ReportsFiltersProps = { value: ReportsFilter; onChange: (next: ReportsFilter) => void; archivedCount: number };

export function ReportsFilters({ value, onChange, archivedCount }: ReportsFiltersProps) {
  const set = (key: keyof ReportsFilter) => (e: { target: { value: string } }) => onChange({ ...value, [key]: e.target.value });
  const dirty = JSON.stringify(value) !== JSON.stringify(EMPTY_REPORTS_FILTER);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative lg:w-64">
        <label htmlFor="rpt-search" className="sr-only">Search reports</label>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
        <input
          id="rpt-search"
          type="search"
          value={value.query}
          onChange={set("query")}
          placeholder="Student, HFID or file name"
          className="h-10 pointer-coarse:h-11 pointer-coarse:text-base w-full rounded-lg border border-input bg-canvas pr-3 pl-9 text-sm text-ink outline-none placeholder:text-ink-faint focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <NativeSelect aria-label="Category" value={value.category} onChange={set("category")} placeholder="All categories" options={Object.entries(REPORT_CATEGORY_LABELS).map(([v, label]) => ({ value: v, label }))} className="w-44" />
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          From
          <Input type="date" value={value.from} onChange={set("from")} className="w-40" aria-label="From date" />
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          To
          <Input type="date" value={value.to} onChange={set("to")} className="w-40" aria-label="To date" />
        </label>
        <ArchiveToggle count={archivedCount} shown={value.showArchived} onToggle={() => onChange({ ...value, showArchived: !value.showArchived })} />
        {dirty && (
          <button type="button" onClick={() => onChange(EMPTY_REPORTS_FILTER)} className="text-sm font-medium text-ink-soft hover:text-ink">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
