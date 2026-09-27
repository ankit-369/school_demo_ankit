"use client";

import { classKey, DIVISIONS, GRADES, gradeLabel, type ClassKey } from "@/lib/types/grade";
import { cn } from "@/lib/utils";

type ClassPickerProps = {
  value: ClassKey[];
  onChange: (next: ClassKey[]) => void;
  disabled?: boolean;
};

/** Grade × division grid for assigning classes to a teacher. */
export function ClassPicker({ value, onChange, disabled }: ClassPickerProps) {
  const toggle = (k: ClassKey) =>
    onChange(value.includes(k) ? value.filter((v) => v !== k) : [...value, k]);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-x-6 gap-y-1.5" role="group" aria-label="Assigned classes">
      {GRADES.map((g) => (
        <div key={g} className="flex items-center justify-between gap-2">
          <span className="text-sm whitespace-nowrap text-ink-soft">{gradeLabel(g)}</span>
          <div className="flex gap-1">
            {DIVISIONS.map((d) => {
              const k = classKey(g, d);
              const on = value.includes(k);
              return (
                <button
                  key={k}
                  type="button"
                  disabled={disabled}
                  aria-pressed={on}
                  aria-label={`${gradeLabel(g)} division ${d}`}
                  onClick={() => toggle(k)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 pointer-coarse:size-10",
                    on ? "border-primary bg-primary text-white" : "border-line text-ink-soft hover:border-ink-faint/60",
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
