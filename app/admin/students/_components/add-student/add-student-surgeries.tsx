"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { localDateString } from "@/lib/format";
import type { Surgery } from "@/lib/types/medical-history";

export type SurgeryDraft = Omit<Surgery, "id"> & { key: string };

const OUTCOME_OPTIONS = [
  { value: "successful", label: "Successful" },
  { value: "complications", label: "Complications" },
  { value: "ongoing-care", label: "Ongoing care" },
];

function key() {
  return `sg-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Optional add-only surgery rows for the Add Student form. */
export function AddStudentSurgeries({ value, onChange }: { value: SurgeryDraft[]; onChange: (next: SurgeryDraft[]) => void }) {
  function add() {
    onChange([...value, { key: key(), name: "", date: localDateString(), hospital: "", outcome: "successful" }]);
  }
  function remove(k: string) {
    onChange(value.filter((s) => s.key !== k));
  }
  function patch(k: string, p: Partial<SurgeryDraft>) {
    onChange(value.map((s) => (s.key === k ? { ...s, ...p } : s)));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">Surgeries <span className="font-normal text-ink-faint">(optional)</span></span>
        <Button type="button" variant="ghost" size="sm" className="h-8 text-primary" onClick={add}>
          <Plus aria-hidden />
          Add row
        </Button>
      </div>
      {value.length > 0 && (
        <ul className="flex flex-col gap-2">
          {value.map((s) => (
            <li key={s.key} className="grid grid-cols-2 gap-2 rounded-lg border border-line p-3 sm:grid-cols-5">
              <Input value={s.name} onChange={(e) => patch(s.key, { name: e.target.value })} placeholder="Procedure" className="sm:col-span-2" />
              <Input type="date" value={s.date} onChange={(e) => patch(s.key, { date: e.target.value })} />
              <Input value={s.hospital} onChange={(e) => patch(s.key, { hospital: e.target.value })} placeholder="Hospital" />
              <div className="flex items-center gap-1.5">
                <NativeSelect value={s.outcome} options={OUTCOME_OPTIONS} onChange={(e) => patch(s.key, { outcome: e.target.value as Surgery["outcome"] })} className="flex-1" />
                <Button type="button" variant="ghost" size="icon" className="size-9 shrink-0 text-danger-ink" onClick={() => remove(s.key)} aria-label="Remove surgery">
                  <Trash2 aria-hidden className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
