"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { targetFor, type ExceptionOutcome, type PromotionPlan } from "@/lib/academic/promotion-plan";
import type { ClassRoster } from "@/lib/academic/roster";
import { pluralize } from "@/lib/format";
import { gradeLabel } from "@/lib/types/grade";
import { ExceptionChoice, type Choice } from "./exception-choice";

type ExceptionsStepProps = {
  roster: ClassRoster[];
  plan: PromotionPlan;
  onChange: (studentId: string, outcome: ExceptionOutcome | null) => void;
};

/** Step 3 — per-student overrides. Everyone not touched follows their class. */
export function ExceptionsStep({ roster, plan, onChange }: ExceptionsStepProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const count = Object.keys(plan.exceptions).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] text-ink-soft" aria-live="polite">
          {count ? `${pluralize(count, "exception")} so far.` : "No exceptions yet — everyone follows their class."} Mark anyone who is repeating the year, moving school, or leaving.
        </p>
        <div className="relative sm:w-64">
          <label htmlFor="exc-search" className="sr-only">Find a student</label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
          <input id="exc-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a student" className="h-10 pointer-coarse:h-11 pointer-coarse:text-base w-full rounded-lg border border-input bg-canvas pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30" />
        </div>
      </div>
      {roster.map((c) => {
        const students = c.students.filter((s) => !q || s.name.toLowerCase().includes(q));
        if (students.length === 0) return null;
        return (
          <section key={c.key} aria-label={`${gradeLabel(c.grade)}-${c.division}`} className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-ink-soft">{gradeLabel(c.grade)}-{c.division}</h3>
            <ul className="divide-y divide-line rounded-lg border border-line">
              {students.map((s) => {
                const target = targetFor(s, plan);
                const defaultLabel = target === "graduate" ? "Graduate" : `Promote → ${target}`;
                return (
                  <li key={s.id} className="flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[15px] text-ink">{s.name}</span>
                    <ExceptionChoice
                      name={`exc-${s.id}`}
                      studentName={s.name}
                      defaultLabel={defaultLabel}
                      value={(plan.exceptions[s.id] ?? "default") as Choice}
                      onChange={(v) => onChange(s.id, v === "default" ? null : v)}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
