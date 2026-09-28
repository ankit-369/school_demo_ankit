"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { HealthFlags } from "@/components/students/health-flags";
import { formatDate } from "@/lib/format";
import { RESULT_STATUS } from "@/lib/labels";
import type { ResultRow } from "@/lib/selectors/screening-results";
import type { ScreeningResultStatus } from "@/lib/types/screening";
import { cn } from "@/lib/utils";

type DoctorResultRowProps = {
  row: ResultRow;
  open: boolean;
  onToggle: () => void;
  onSubmit: (status: ScreeningResultStatus, notes: string) => void;
};

const OPTIONS: ScreeningResultStatus[] = ["completed", "follow-up", "pending"];

export function DoctorResultRow({ row, open, onToggle, onSubmit }: DoctorResultRowProps) {
  const { student: s, result } = row;
  const [status, setStatus] = useState<ScreeningResultStatus>(result && result.status !== "pending" ? result.status : "completed");
  const [notes, setNotes] = useState(result?.notes ?? "");
  const panelId = `dr-${s.id}`;

  return (
    <li className="bg-canvas">
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle} className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-surface">
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[16px] font-medium text-ink">{s.name}</span>
          <span className="text-[13px] text-ink-faint">{row.classKey} · Roll {s.rollNumber} · {s.gender === "male" ? "M" : "F"}, born {formatDate(s.dob)}</span>
        </span>
        {result && result.status !== "pending" ? <StatusBadge {...RESULT_STATUS[result.status]} /> : <StatusBadge tone="neutral" label="Not seen" />}
        <ChevronDown aria-hidden className={cn("size-5 shrink-0 text-ink-faint transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div id={panelId} className="flex flex-col gap-4 border-t border-line bg-surface/60 px-4 py-4">
          <HealthFlags allergies={s.medicalHistory.school.allergies} conditions={s.medicalHistory.school.conditions} max={6} />
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-medium text-ink">Result</legend>
            <div className="grid grid-cols-3 gap-2">
              {OPTIONS.map((o) => (
                <label key={o} className={cn("flex h-12 cursor-pointer items-center justify-center rounded-lg border-2 text-sm font-semibold transition-colors duration-150 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30", status === o ? "border-primary bg-primary/5 text-primary" : "border-line bg-canvas text-ink-soft")}>
                  <input type="radio" name={`${panelId}-status`} value={o} checked={status === o} onChange={() => setStatus(o)} className="sr-only" />
                  {RESULT_STATUS[o].label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${panelId}-notes`} className="text-sm font-medium text-ink">Findings</label>
            <Textarea id={`${panelId}-notes`} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Clinical findings and advice for the family" className="text-[16px]" />
          </div>
          <button type="button" onClick={() => onSubmit(status, notes)} className="h-12 rounded-xl bg-primary text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-primary/90">
            Submit result
          </button>
        </div>
      )}
    </li>
  );
}
