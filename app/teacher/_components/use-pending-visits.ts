"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store/app-store";
import type { ClinicalNote } from "@/lib/types/clinical-note";
import type { Student } from "@/lib/types/student";
import { useMyClass } from "./use-my-class";

export type PendingVisit = { note: ClinicalNote; student: Student };

/** Nurse (or any addNotes-only) visits for this teacher's own students, still waiting on a guardian message. */
export function usePendingVisits(): PendingVisit[] {
  const { students } = useMyClass();
  const notes = useAppStore((s) => s.notes);
  return useMemo(() => {
    const byId = new Map(students.map((s) => [s.id, s]));
    return notes
      .filter((n) => n.guardianStatus === "pending" && byId.has(n.studentId))
      .map((note) => ({ note, student: byId.get(note.studentId)! }))
      .sort((a, b) => b.note.dateTime.localeCompare(a.note.dateTime));
  }, [notes, students]);
}
