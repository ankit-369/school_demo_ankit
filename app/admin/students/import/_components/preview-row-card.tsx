"use client";

import { ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { IMPORT_FIELDS, type ImportFieldKey } from "@/lib/import/import-fields";
import type { DraftValues, ImportRowResult } from "@/lib/import/import-row";
import { RowFieldInput } from "./row-field-input";

type PreviewRowCardProps = {
  id: string;
  values: DraftValues;
  result: ImportRowResult;
  selected: boolean;
  onToggleSelect: () => void;
  onFieldChange: (key: ImportFieldKey, value: string) => void;
  onRemove: () => void;
};

const isReady = (r: ImportRowResult) => Boolean(r.input) && r.errors.length === 0;

/** Mobile equivalent of a table row: an expandable card with every field editable. */
export function PreviewRowCard({ id, values, result, selected, onToggleSelect, onFieldChange, onRemove }: PreviewRowCardProps) {
  return (
    <details className="group rounded-lg border border-line [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-surface">
        <input type="checkbox" checked={selected} onChange={onToggleSelect} onClick={(e) => e.stopPropagation()} className="size-4 shrink-0" aria-label="Select row" />
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink">{values.name || `Row ${result.line}`}</span>
        {isReady(result) ? <StatusBadge tone="success" label="Ready" /> : <StatusBadge tone="danger" label={`${result.errors.length} issue${result.errors.length === 1 ? "" : "s"}`} />}
        <ChevronDown aria-hidden className="size-4 shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-3 border-t border-line px-4 py-4">
        {IMPORT_FIELDS.map((f) => (
          <label key={f.key} className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-ink-soft">
              {f.label}
              {f.required && <span className="text-danger-ink"> *</span>}
            </span>
            <RowFieldInput id={`${id}-${f.key}`} fieldKey={f.key} values={values} onChange={onFieldChange} />
          </label>
        ))}
        {result.errors.length > 0 && <p className="text-[13px] text-danger-ink">{result.errors.join(" · ")}</p>}
        <Button variant="ghost" size="sm" className="h-9 w-fit text-danger-ink" onClick={onRemove}>
          <Trash2 aria-hidden />
          Remove row
        </Button>
      </div>
    </details>
  );
}
