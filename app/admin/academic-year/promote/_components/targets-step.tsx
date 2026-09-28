import { ArrowRight } from "lucide-react";
import { NativeSelect } from "@/components/ui/native-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { suggestedTarget, type ClassTarget, type PromotionPlan } from "@/lib/academic/promotion-plan";
import type { ClassRoster } from "@/lib/academic/roster";
import { GRADES, gradeLabel, type ClassKey, type Grade } from "@/lib/types/grade";

type TargetsStepProps = {
  roster: ClassRoster[];
  targets: PromotionPlan["targets"];
  onChange: (key: ClassKey, target: ClassTarget) => void;
};

function options(current: Grade) {
  const suggested = suggestedTarget(current);
  const grades = GRADES.slice(GRADES.indexOf(current)).map((g) => ({
    value: g,
    label: `${gradeLabel(g)}${g === current ? " (repeat year)" : ""}${g === suggested ? " — suggested" : ""}`,
  }));
  return [...grades, { value: "graduate", label: `Graduate — leaves school${suggested === "graduate" ? " — suggested" : ""}` }];
}

/** Step 2 — each class's destination, pre-filled with the next grade up. */
export function TargetsStep({ roster, targets, onChange }: TargetsStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] text-ink-soft">
        Each class moves up one grade by default. Change a class only if the whole class goes somewhere else — individual students are handled in the next step.
      </p>
      <ul className="divide-y divide-line rounded-lg border border-line">
        {roster.map((c) => {
          const suggested = suggestedTarget(c.grade);
          const value = targets[c.key] ?? suggested;
          const id = `target-${c.key}`;
          return (
            <li key={c.key} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
              <label htmlFor={id} className="flex flex-1 items-center gap-2">
                <span className="font-medium text-ink">{gradeLabel(c.grade)}-{c.division}</span>
                <span className="text-sm text-ink-faint">· {c.students.length} students</span>
              </label>
              <div className="flex items-center gap-3">
                <ArrowRight aria-hidden className="hidden size-4 text-ink-faint sm:block" />
                <NativeSelect id={id} value={value} options={options(c.grade)} onChange={(e) => onChange(c.key, e.target.value as ClassTarget)} className="w-full sm:w-72" />
                {value !== suggested && <StatusBadge tone="warning" label="Changed" className="shrink-0" />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
