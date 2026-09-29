"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { IMPORT_FIELDS, type ImportFieldKey } from "@/lib/import/import-fields";
import { emptyDraftValues, newRowId, validateDraftRow, type DraftRow, type ImportRowResult, type RollKey } from "@/lib/import/import-row";
import { pluralize } from "@/lib/format";
import type { Student } from "@/lib/types/student";
import { DIVISIONS, GRADES, type Division, type Grade } from "@/lib/types/grade";
import type { NewStudentInput } from "@/lib/store/slices/students-slice";
import { PreviewRowCard } from "./preview-row-card";
import { RowFieldInput } from "./row-field-input";

const isReady = (r: ImportRowResult) => Boolean(r.input) && r.errors.length === 0;

function extractRollKey(id: string, values: DraftRow["values"]): RollKey | null {
  const grade = values.grade as Grade;
  const division = values.division as Division;
  const roll = Number(values.rollNumber);
  if (!(GRADES as readonly string[]).includes(grade) || !(DIVISIONS as readonly string[]).includes(division) || !Number.isInteger(roll) || roll <= 0) return null;
  return { id, grade, division, roll };
}

type PreviewStepProps = {
  rows: DraftRow[];
  onChange: (rows: DraftRow[]) => void;
  existingStudents: Student[];
  onBack: () => void;
  onImport: (inputs: NewStudentInput[]) => void;
};

export function PreviewStep({ rows, onChange, existingStudents, onBack, onImport }: PreviewStepProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [onlyIssues, setOnlyIssues] = useState(false);

  const results = useMemo(() => {
    const rollKeys = rows.map((r) => extractRollKey(r.id, r.values)).filter((k): k is RollKey => k !== null);
    return rows.map((row, i) => ({ row, result: validateDraftRow(row.values, row.id, i + 1, existingStudents, rollKeys) }));
  }, [rows, existingStudents]);

  const readyCount = results.filter((r) => isReady(r.result)).length;
  const issueCount = results.length - readyCount;
  const shown = onlyIssues ? results.filter((r) => !isReady(r.result)) : results;
  const allReady = results.length > 0 && issueCount === 0;

  function setField(id: string, key: ImportFieldKey, value: string) {
    onChange(rows.map((r) => (r.id === id ? { ...r, values: { ...r.values, [key]: value } } : r)));
  }

  function removeRow(id: string) {
    const index = rows.findIndex((r) => r.id === id);
    const removed = rows[index];
    if (!removed) return;
    onChange(rows.filter((r) => r.id !== id));
    toast("Row removed", { action: { label: "Undo", onClick: () => onChange([...rows.slice(0, index), removed, ...rows.slice(index)]) } });
  }

  function removeSelected() {
    if (selected.size === 0) return;
    const removed = rows.filter((r) => selected.has(r.id));
    onChange(rows.filter((r) => !selected.has(r.id)));
    toast(`${pluralize(removed.length, "row")} removed`, { action: { label: "Undo", onClick: () => onChange([...rows, ...removed]) } });
    setSelected(new Set());
  }

  function removeAllWithErrors() {
    const removed = results.filter((r) => !isReady(r.result)).map((r) => r.row);
    if (removed.length === 0) return;
    onChange(rows.filter((r) => isReady(results.find((res) => res.row.id === r.id)!.result)));
    toast(`${pluralize(removed.length, "row")} removed`, { action: { label: "Undo", onClick: () => onChange([...rows, ...removed]) } });
  }

  function toggleSelect(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft" aria-live="polite">
          {readyCount} ready, {issueCount} need fixing
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 border-line" onClick={() => onChange([...rows, { id: newRowId(), values: emptyDraftValues() }])}>
            <Plus aria-hidden />
            Add blank row
          </Button>
          <Button variant={onlyIssues ? "default" : "outline"} size="sm" className={onlyIssues ? "h-9" : "h-9 border-line"} onClick={() => setOnlyIssues((v) => !v)}>
            Show only rows needing fixes
          </Button>
          {selected.size > 0 && (
            <Button variant="outline" size="sm" className="h-9 border-line text-danger-ink" onClick={removeSelected}>
              <Trash2 aria-hidden />
              Remove selected ({selected.size})
            </Button>
          )}
          {issueCount > 0 && (
            <Button variant="outline" size="sm" className="h-9 border-line text-danger-ink" onClick={removeAllWithErrors}>
              <Trash2 aria-hidden />
              Remove all rows with errors
            </Button>
          )}
        </div>
      </div>

      {/* Desktop: editable table */}
      <div className="hidden overflow-x-auto rounded-xl border border-line md:block">
        <table className="w-full text-sm">
          <caption className="sr-only">Import preview</caption>
          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="border-b border-line text-left text-xs font-medium text-ink-soft uppercase">
              <th scope="col" className="h-11 w-10 px-3"><span className="sr-only">Select</span></th>
              <th scope="col" className="h-11 px-3">Status</th>
              {IMPORT_FIELDS.map((f) => (
                <th key={f.key} scope="col" className="h-11 min-w-36 px-3 whitespace-nowrap">
                  {f.label}
                  {f.required && <span className="text-danger-ink"> *</span>}
                </th>
              ))}
              <th scope="col" className="h-11 px-3"><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            {shown.map(({ row, result }) => {
              const invalidFields = new Set(IMPORT_FIELDS.filter((f) => result.errors.some((err) => err.startsWith(f.label))).map((f) => f.key));
              return (
                <tr key={row.id} className="border-b border-line last:border-b-0 hover:bg-surface/50" title={result.errors.join(" · ") || undefined}>
                  <td className="px-3 py-2">
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} aria-label="Select row" className="size-4" />
                  </td>
                  <td className="px-3 py-2">
                    {isReady(result) ? <StatusBadge tone="success" label="Ready" /> : <StatusBadge tone="danger" label={`${result.errors.length}`} />}
                  </td>
                  {IMPORT_FIELDS.map((f) => (
                    <td key={f.key} className="px-3 py-2">
                      <RowFieldInput id={`${row.id}-${f.key}`} fieldKey={f.key} values={row.values} onChange={(key, value) => setField(row.id, key, value)} invalid={invalidFields.has(f.key)} className="h-9 min-w-32" />
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <Button variant="ghost" size="icon" className="size-9 text-danger-ink" onClick={() => removeRow(row.id)} aria-label="Remove row">
                      <Trash2 aria-hidden className="size-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && <p className="px-4 py-6 text-center text-sm text-ink-faint">No rows to show.</p>}
      </div>

      {/* Mobile: expandable cards */}
      <ul className="flex flex-col gap-2 md:hidden">
        {shown.map(({ row, result }) => (
          <li key={row.id}>
            <PreviewRowCard
              id={row.id}
              values={row.values}
              result={result}
              selected={selected.has(row.id)}
              onToggleSelect={() => toggleSelect(row.id)}
              onFieldChange={(key, value) => setField(row.id, key, value)}
              onRemove={() => removeRow(row.id)}
            />
          </li>
        ))}
        {shown.length === 0 && <p className="py-6 text-center text-sm text-ink-faint">No rows to show.</p>}
      </ul>

      <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft" aria-live="polite">
          {allReady ? `${pluralize(readyCount, "student")} ready to add.` : "Fix or remove every row with an issue to continue."}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>Back to mapping</Button>
          <Button disabled={!allReady} onClick={() => onImport(results.map((r) => r.result.input!))}>
            Add {pluralize(readyCount, "student")}
          </Button>
        </div>
      </div>
    </div>
  );
}
