import { localDateString } from "@/lib/format";
import type { Camp } from "@/lib/types/camp";
import type { Screening } from "@/lib/types/screening";
import type { Student } from "@/lib/types/student";
import { isScreened, screeningRows, type ResultRow } from "./screening-results";

/**
 * Camp-day "station": the screening a nurse is running. Defaults to today's
 * screening with students still to see, then any with work left, then the first.
 */
export function defaultStation(camp: Camp, students: Student[], today = localDateString()): Screening | undefined {
  const hasWork = (s: Screening) => screeningRows(s, students).some(isToDo);
  return (
    camp.screenings.find((s) => s.date === today && hasWork(s)) ??
    camp.screenings.find(hasWork) ??
    camp.screenings[0]
  );
}

export function resolveStation(camp: Camp, students: Student[], requested?: string | null) {
  return camp.screenings.find((s) => s.id === requested) ?? defaultStation(camp, students);
}

/** Recorded as pending with this note when a student isn't in school on camp day. */
export const ABSENT_NOTE = "Absent on camp day";

export function isAbsent(row: ResultRow) {
  return row.result?.status === "pending" && row.result.notes === ABSENT_NOTE;
}

/** Still needs seeing today: not screened and not marked absent. */
export function isToDo(row: ResultRow) {
  return !isScreened(row) && !isAbsent(row);
}

/** The next student still to screen after `currentId`, wrapping round; null when everyone is done. */
export function nextToScreen(rows: ResultRow[], currentId?: string): ResultRow | null {
  const start = currentId ? rows.findIndex((r) => r.student.id === currentId) + 1 : 0;
  const ordered = [...rows.slice(start), ...rows.slice(0, start)];
  return ordered.find((r) => isToDo(r) && r.student.id !== currentId) ?? null;
}

export type StationProgress = { screening: Screening; done: number; total: number; followUps: number };

export function stationProgress(camp: Camp, students: Student[]): StationProgress[] {
  return camp.screenings.map((screening) => {
    const rows = screeningRows(screening, students);
    return {
      screening,
      done: rows.filter(isScreened).length,
      total: rows.length,
      followUps: rows.filter((r) => r.result?.status === "follow-up").length,
    };
  });
}

/** Distinct students with every targeted screening in the camp done, out of all targeted. */
export function campStudentsDone(camp: Camp, students: Student[]) {
  const all = new Map<string, boolean>();
  for (const s of camp.screenings) {
    for (const r of screeningRows(s, students)) {
      all.set(r.student.id, (all.get(r.student.id) ?? true) && isScreened(r));
    }
  }
  return { done: [...all.values()].filter(Boolean).length, total: all.size };
}

export function stationHref(campId: string, page: "roster" | "summary", screeningId?: string) {
  return `/nurse/camp/${campId}/${page}${screeningId ? `?s=${screeningId}` : ""}`;
}

export function screenHref(campId: string, studentId: string, screeningId: string) {
  return `/nurse/camp/${campId}/student/${studentId}/screen?s=${screeningId}`;
}
