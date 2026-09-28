"use client";

import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { IMPORT_FIELDS, missingRequired, type ColumnMapping } from "@/lib/import/import-fields";
import type { ParsedCsv } from "./upload-step";

type MappingStepProps = {
  csv: ParsedCsv;
  mapping: ColumnMapping;
  onChange: (m: ColumnMapping) => void;
  onBack: () => void;
  onNext: () => void;
};

export function MappingStep({ csv, mapping, onChange, onBack, onNext }: MappingStepProps) {
  const missing = missingRequired(mapping);
  const options = [{ value: "-1", label: "— Not in file —" }, ...csv.headers.map((h, i) => ({ value: String(i), label: h || `Column ${i + 1}` }))];
  const autoMatched = IMPORT_FIELDS.filter((f) => mapping[f.key] >= 0).length;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[15px] text-ink-soft">
        We matched {autoMatched} of {IMPORT_FIELDS.length} fields from <span className="font-medium text-ink">{csv.fileName}</span>. Check each one — the sample column shows the first student&apos;s value.
      </p>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-sm">
          <caption className="sr-only">Column mapping</caption>
          <thead className="bg-surface">
            <tr className="border-b border-line text-left text-xs font-medium text-ink-soft uppercase">
              <th scope="col" className="h-11 px-4">Field</th>
              <th scope="col" className="h-11 px-4">Column in your file</th>
              <th scope="col" className="h-11 px-4">Sample</th>
            </tr>
          </thead>
          <tbody>
            {IMPORT_FIELDS.map((f) => {
              const idx = mapping[f.key];
              const id = `map-${f.key}`;
              return (
                <tr key={f.key} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-2.5 align-middle">
                    <label htmlFor={id} className="flex flex-col">
                      <span className="font-medium text-ink">
                        {f.label}
                        {f.required && <span className="text-danger-ink"> *</span>}
                      </span>
                      {f.hint && <span className="text-[13px] text-ink-faint">{f.hint}</span>}
                    </label>
                  </td>
                  <td className="w-64 px-4 py-2.5">
                    <NativeSelect id={id} value={String(idx)} options={options} aria-invalid={f.required && idx < 0 ? true : undefined} onChange={(e) => onChange({ ...mapping, [f.key]: Number(e.target.value) })} />
                  </td>
                  <td className="max-w-56 truncate px-4 py-2.5 text-ink-soft">{idx >= 0 ? csv.rows[0]?.[idx] || <span className="text-ink-faint">(blank)</span> : <span className="text-ink-faint">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite">
          {missing.length > 0 ? (
            <StatusBadge tone="warning" label={`Map ${missing.map((m) => m.label.toLowerCase()).join(", ")} to continue`} className="h-auto py-1 whitespace-normal" />
          ) : (
            <StatusBadge tone="success" label="All required fields mapped" />
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button disabled={missing.length > 0} onClick={onNext}>Preview students</Button>
        </div>
      </div>
    </div>
  );
}
