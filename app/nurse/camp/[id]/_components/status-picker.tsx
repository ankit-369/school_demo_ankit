import { CircleCheck, CircleSlash, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CampDayChoice = "completed" | "follow-up" | "absent";

const CHOICES: { value: CampDayChoice; label: string; icon: LucideIcon; on: string }[] = [
  { value: "completed", label: "Completed", icon: CircleCheck, on: "border-success bg-success/10 text-success-ink [&_svg]:text-success" },
  { value: "follow-up", label: "Follow-up", icon: TriangleAlert, on: "border-warning bg-warning/10 text-warning-ink [&_svg]:text-warning" },
  { value: "absent", label: "Absent", icon: CircleSlash, on: "border-ink-faint bg-surface text-ink [&_svg]:text-ink-soft" },
];

/** Three large radio tiles — icon + label + colour, never colour alone. */
export function StatusPicker({ value, onChange }: { value: CampDayChoice | null; onChange: (v: CampDayChoice) => void }) {
  return (
    <div role="radiogroup" aria-label="Result" className="grid grid-cols-3 gap-2">
      {CHOICES.map((c) => {
        const on = value === c.value;
        return (
          <label
            key={c.value}
            className={cn(
              "flex h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 text-[15px] font-semibold transition-colors duration-150 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30",
              on ? c.on : "border-line bg-canvas text-ink-soft hover:border-ink-faint/60",
            )}
          >
            <input type="radio" name="camp-day-status" value={c.value} checked={on} onChange={() => onChange(c.value)} className="sr-only" />
            <c.icon aria-hidden className="size-6" />
            {c.label}
          </label>
        );
      })}
    </div>
  );
}
