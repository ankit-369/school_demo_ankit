import { classKey, DIVISIONS, GRADES, type ClassKey } from "@/lib/types/grade";
import type { Screening, ScreeningResult } from "@/lib/types/screening";
import type { Student } from "@/lib/types/student";

export type ResultRow = {
  student: Student;
  classKey: ClassKey;
  /** undefined → targeted but not screened yet. */
  result?: ScreeningResult;
  /** Whether this screening's result is already on the student's hfiles.in record. */
  sentToHfiles: boolean;
};

export function hfilesEntryId(screeningId: string, studentId: string) {
  return `lab-${screeningId}-${studentId}`;
}

/** Everyone with a result, plus active students in the target classes who haven't been screened. */
export function screeningRows(screening: Screening, students: Student[]): ResultRow[] {
  const byId = new Map(screening.results.map((r) => [r.studentId, r]));
  return students
    .filter((s) => byId.has(s.id) || (s.status === "active" && screening.targetStandards.includes(s.grade)))
    .map((s) => ({
      student: s,
      classKey: classKey(s.grade, s.division),
      result: byId.get(s.id),
      sentToHfiles: s.medicalHistory.hfiles.labReports.some((l) => l.id === hfilesEntryId(screening.id, s.id)),
    }))
    .sort(
      (a, b) =>
        GRADES.indexOf(a.student.grade) - GRADES.indexOf(b.student.grade) ||
        DIVISIONS.indexOf(a.student.division) - DIVISIONS.indexOf(b.student.division) ||
        a.student.rollNumber - b.student.rollNumber,
    );
}

/** Distinct classes present in the rows, in school order. */
export function rowClasses(rows: ResultRow[]): ClassKey[] {
  return [...new Set(rows.map((r) => r.classKey))];
}

export function isScreened(row: ResultRow) {
  return Boolean(row.result && row.result.status !== "pending");
}
