import { ChevronDown } from "lucide-react";
import { HealthFlags } from "@/components/students/health-flags";
import type { ClassRoster } from "@/lib/academic/roster";
import { gradeLabel } from "@/lib/types/grade";

/** Step 1 — read-only review of who is in which class right now. */
export function RosterStep({ roster, year }: { roster: ClassRoster[]; year: string }) {
  const total = roster.reduce((n, c) => n + c.students.length, 0);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] text-ink-soft">
        {total} active students in {roster.length} classes for {year}. Expand a class to check its list before moving on.
      </p>
      <ul className="flex flex-col gap-2">
        {roster.map((c) => (
          <li key={c.key}>
            <details className="group rounded-lg border border-line [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-surface">
                <ChevronDown aria-hidden className="size-4 shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-180" />
                <span className="w-28 font-medium text-ink">{gradeLabel(c.grade)}-{c.division}</span>
                <span className="flex-1 truncate text-sm text-ink-soft">{c.teacherName}</span>
                <span className="tabular text-sm text-ink">{c.students.length} {c.students.length === 1 ? "student" : "students"}</span>
              </summary>
              <ul className="divide-y divide-line border-t border-line">
                {c.students.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 pl-11">
                    <span className="text-[15px] text-ink">
                      <span className="tabular mr-2 text-ink-faint">#{s.rollNumber}</span>
                      {s.name}
                    </span>
                    <HealthFlags allergies={s.medicalHistory.school.allergies} conditions={s.medicalHistory.school.conditions} max={2} />
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
