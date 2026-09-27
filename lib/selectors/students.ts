import type { Camp } from "@/lib/types/camp";
import type { Screening, ScreeningResult } from "@/lib/types/screening";
import type { Student } from "@/lib/types/student";

export function hasHealthFlags(s: Student) {
  const { allergies, conditions } = s.medicalHistory.school;
  return allergies.length + conditions.length > 0;
}

/** Every distinct allergy/condition across students, for the directory filter. */
export function allHealthTags(students: Student[]) {
  const tags = new Set<string>();
  students.forEach((s) => {
    s.medicalHistory.school.allergies.forEach((a) => tags.add(a));
    s.medicalHistory.school.conditions.forEach((c) => tags.add(c));
  });
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function isHfilesConnected(s: Student) {
  return s.medicalHistory.hfiles.lastSyncedAt !== null;
}

export function studentMatchesQuery(s: Student, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [s.name, s.hfid, s.admissionNo].some((v) => v.toLowerCase().includes(q));
}

export type StudentScreeningRow = {
  camp: Camp;
  screening: Screening;
  /** undefined → targeted but not yet screened (upcoming or not reached). */
  result?: ScreeningResult;
};

/** Every screening this student was (or will be) part of, newest first. */
export function studentScreenings(student: Student, camps: Camp[]): StudentScreeningRow[] {
  return camps
    .flatMap((camp) =>
      camp.screenings.flatMap((screening) => {
        const result = screening.results.find((r) => r.studentId === student.id);
        const targeted = screening.targetStandards.includes(student.grade);
        return result || targeted ? [{ camp, screening, result }] : [];
      }),
    )
    .sort((a, b) => b.screening.date.localeCompare(a.screening.date));
}
