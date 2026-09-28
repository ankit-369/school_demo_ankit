"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChipGroup } from "@/components/ui/chip-group";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, pluralize } from "@/lib/format";
import type { ImportRowResult } from "@/lib/import/import-row";
import { classKey } from "@/lib/types/grade";
import type { Column } from "@/lib/types/table";

type View = "all" | "ready" | "issues";

const isReady = (r: ImportRowResult) => r.input && r.errors.length === 0;

const columns: Column<ImportRowResult>[] = [
  { id: "line", header: "Row", align: "right", cell: (r) => r.line },
  {
    id: "status",
    header: "Status",
    cell: (r) =>
      isReady(r) ? <StatusBadge tone="success" label="Ready" /> : r.duplicate ? <StatusBadge tone="warning" label="Duplicate" /> : <StatusBadge tone="danger" label="Needs fixing" />,
  },
  { id: "name", header: "Name", cell: (r) => <span className="font-medium">{r.input?.name ?? "—"}</span> },
  { id: "class", header: "Class", cell: (r) => (r.input ? classKey(r.input.grade, r.input.division) : "—") },
  { id: "dob", header: "Date of birth", cell: (r) => (r.input ? formatDate(r.input.dob) : "—") },
  { id: "guardian", header: "Guardian", cell: (r) => r.input?.guardian.name ?? "—" },
  {
    id: "issues",
    header: "Issues",
    className: "whitespace-normal min-w-56",
    cell: (r) => (r.errors.length ? <span className="text-sm text-danger-ink">{r.errors.join(" · ")}</span> : <span className="text-ink-faint">—</span>),
  },
];

type PreviewStepProps = { results: ImportRowResult[]; onBack: () => void; onImport: () => void };

export function PreviewStep({ results, onBack, onImport }: PreviewStepProps) {
  const [view, setView] = useState<View>("all");
  const ready = results.filter(isReady);
  const issues = results.length - ready.length;
  const rows = view === "ready" ? ready : view === "issues" ? results.filter((r) => !isReady(r)) : results;

  return (
    <div className="flex flex-col gap-4">
      <ChipGroup
        label="Show rows"
        value={view}
        onChange={setView}
        chips={[
          { value: "all", label: `All (${results.length})` },
          { value: "ready", label: `Ready (${ready.length})` },
          { value: "issues", label: `Issues (${issues})` },
        ]}
      />
      <DataTable caption="Import preview" columns={columns} rows={rows} getRowId={(r) => String(r.line)} scrollClassName="max-h-[480px]" />
      <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft" aria-live="polite">
          {pluralize(ready.length, "student")} will be added{issues > 0 && ` · ${pluralize(issues, "row")} skipped — fix them in the file and import again`}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>Back to mapping</Button>
          <Button disabled={ready.length === 0} onClick={onImport}>
            Import {pluralize(ready.length, "student")}
          </Button>
        </div>
      </div>
    </div>
  );
}
