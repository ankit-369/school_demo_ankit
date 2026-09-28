"use client";

import Link from "next/link";
import { ChevronRight, NotebookPen, ShieldAlert, Users } from "lucide-react";
import { useState } from "react";
import { ChipGroup } from "@/components/ui/chip-group";
import { EmptyState } from "@/components/ui/empty-state";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { HealthFlags } from "@/components/students/health-flags";
import { classKey, type ClassKey } from "@/lib/types/grade";
import { useMyClass } from "./use-my-class";

/** Roster only: names and health badges. Tapping a student opens their action card, not their history. */
export function ClassRoster() {
  const { teacher, classes, students } = useMyClass();
  const [filter, setFilter] = useState<ClassKey | "all">("all");
  const shown = filter === "all" ? students : students.filter((s) => classKey(s.grade, s.division) === filter);
  const flagged = students.filter((s) => s.medicalHistory.school.allergies.length + s.medicalHistory.school.conditions.length > 0).length;

  if (!teacher || classes.length === 0) {
    return <EmptyState icon={Users} title="No classes assigned" description="Ask an administrator to assign your classes on the staff page." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{teacher.name}</h1>
          <p className="mt-1 text-[15px] text-ink-soft">
            {students.length} students · {flagged} with a health alert
          </p>
        </div>
        <Link href="/teacher/incident/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-primary/90">
          <NotebookPen aria-hidden className="size-4" />
          Log an incident
        </Link>
      </header>
      {classes.length > 1 && (
        <ChipGroup
          label="Class"
          value={filter}
          onChange={setFilter}
          chips={[{ value: "all" as const, label: "All my classes" }, ...classes.map((c) => ({ value: c, label: c }))]}
        />
      )}
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-canvas">
        {shown.map((s) => {
          const { allergies, conditions } = s.medicalHistory.school;
          const alert = allergies.length + conditions.length > 0;
          return (
            <li key={s.id}>
              <Link href={`/teacher/class/${s.id}/alert`} className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-surface">
                <StudentAvatar name={s.name} photoUrl={s.photoUrl} size="md" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[16px] font-medium text-ink">{s.name}</span>
                    <span className="shrink-0 text-[13px] text-ink-faint">{classKey(s.grade, s.division)} · #{s.rollNumber}</span>
                  </span>
                  <HealthFlags allergies={allergies} conditions={conditions} max={3} />
                </div>
                {alert && <ShieldAlert aria-label="Has an action plan" className="size-5 shrink-0 text-danger" />}
                <ChevronRight aria-hidden className="size-5 shrink-0 text-ink-faint" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
