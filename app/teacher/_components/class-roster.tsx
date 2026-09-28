"use client";

import Link from "next/link";
import { NotebookPen, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { ChipGroup } from "@/components/ui/chip-group";
import { EmptyState } from "@/components/ui/empty-state";
import { classKey, type ClassKey } from "@/lib/types/grade";
import { ClassRosterRow, hasHealthAlert } from "./class-roster-row";
import { useMyClass } from "./use-my-class";

/**
 * Roster only: names and health badges. Tapping a student opens their action card, not their history.
 * `alertsOnly` narrows it to students with an allergy or condition (the Alerts tab).
 */
export function ClassRoster({ alertsOnly = false }: { alertsOnly?: boolean }) {
  const { teacher, classes, students } = useMyClass();
  const [filter, setFilter] = useState<ClassKey | "all">("all");
  const pool = alertsOnly ? students.filter(hasHealthAlert) : students;
  const shown = filter === "all" ? pool : pool.filter((s) => classKey(s.grade, s.division) === filter);
  const flagged = students.filter(hasHealthAlert).length;

  if (!teacher || classes.length === 0) {
    return <EmptyState icon={Users} title="No classes assigned" description="Ask an administrator to assign your classes on the staff page." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{alertsOnly ? "Health alerts" : teacher.name}</h1>
          <p className="mt-1 text-[15px] text-ink-soft">
            {alertsOnly ? "Students with an allergy or condition. Tap one for their action plan." : `${students.length} students · ${flagged} with a health alert`}
          </p>
        </div>
        {!alertsOnly && (
          <Link href="/teacher/incident/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-primary/90">
            <NotebookPen aria-hidden className="size-4" />
            Log an incident
          </Link>
        )}
      </header>
      {classes.length > 1 && (
        <ChipGroup
          label="Class"
          value={filter}
          onChange={setFilter}
          chips={[{ value: "all" as const, label: "All my classes" }, ...classes.map((c) => ({ value: c, label: c }))]}
        />
      )}
      {shown.length === 0 ? (
        <EmptyState
          icon={alertsOnly ? ShieldCheck : Users}
          title={alertsOnly ? "No health alerts here" : "No students in this class yet"}
          description={
            alertsOnly
              ? "No one here has an allergy or condition on the school record. If that changes, they'll show up here."
              : "Once the office adds students to this class, they'll appear here."
          }
          className="rounded-xl border border-line bg-canvas"
        />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-canvas">
          {shown.map((s) => (
            <ClassRosterRow key={s.id} student={s} />
          ))}
        </ul>
      )}
    </div>
  );
}
