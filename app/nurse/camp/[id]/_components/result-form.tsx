"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FINDING_PRESETS } from "@/lib/data/finding-presets";
import { ABSENT_NOTE } from "@/lib/selectors/camp-day";
import type { ScreeningResult, ScreeningType } from "@/lib/types/screening";
import { cn } from "@/lib/utils";
import { StatusPicker, type CampDayChoice } from "./status-picker";

type ResultFormProps = {
  type: ScreeningType;
  existing?: ScreeningResult;
  nextName: string | null;
  onSave: (choice: CampDayChoice, notes: string) => void;
  onSkip: () => void;
};

function initialChoice(r?: ScreeningResult): CampDayChoice | null {
  if (!r) return null;
  if (r.status === "pending") return r.notes === ABSENT_NOTE ? "absent" : null;
  return r.status;
}

/** Keyed on the student by its parent, so every student starts from their own saved result (or blank). */
export function ResultForm({ type, existing, nextName, onSave, onSkip }: ResultFormProps) {
  const [choice, setChoice] = useState<CampDayChoice | null>(initialChoice(existing));
  const [notes, setNotes] = useState(existing?.notes === ABSENT_NOTE ? "" : (existing?.notes ?? ""));

  const sentences = notes.split(/\.\s+|\.$/).map((s) => s.trim()).filter(Boolean);
  function togglePreset(p: string) {
    const next = sentences.includes(p) ? sentences.filter((s) => s !== p) : [...sentences, p];
    setNotes(next.join(". "));
  }

  return (
    <div className="flex flex-col gap-5">
      <StatusPicker value={choice} onChange={setChoice} />
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Quick findings</span>
        <div className="flex flex-wrap gap-2">
          {FINDING_PRESETS[type].map((p) => {
            const on = sentences.includes(p);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={on}
                onClick={() => togglePreset(p)}
                className={cn(
                  "min-h-11 rounded-full border px-3.5 text-left text-sm font-medium transition-colors duration-150",
                  on ? "border-primary bg-primary/5 text-primary" : "border-line bg-canvas text-ink-soft hover:text-ink",
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cd-notes" className="text-sm font-medium text-ink">Notes <span className="font-normal text-ink-faint">(optional)</span></label>
        <Textarea id="cd-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="text-[16px]" />
      </div>
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-canvas/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-2">
          <button type="button" onClick={onSkip} className="h-14 w-28 shrink-0 rounded-xl border border-line bg-canvas text-[16px] font-medium text-ink-soft transition-colors duration-150 hover:bg-surface">
            Skip
          </button>
          <button
            type="button"
            disabled={!choice}
            onClick={() => choice && onSave(choice, choice === "absent" ? ABSENT_NOTE : notes.trim())}
            className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[16px] font-semibold text-white transition-colors duration-150 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="truncate">{nextName ? `Save & next · ${nextName.split(" ")[0]}` : "Save & finish"}</span>
            <ArrowRight aria-hidden className="size-5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
