import { localDateString } from "@/lib/format";
import type { Camp, CampPhase } from "@/lib/types/camp";
import { GRADES, type Grade } from "@/lib/types/grade";
import type { Screening } from "@/lib/types/screening";
import type { Student } from "@/lib/types/student";

/** Date-only comparison against today (local), so a camp ending today is still in progress. */
export function campPhase(camp: Camp, now = new Date()): CampPhase {
  const today = localDateString(now);
  if (today < camp.startDate) return "upcoming";
  if (today > camp.endDate) return "completed";
  return "in-progress";
}

export function campStandards(camp: Camp): Grade[] {
  const set = new Set(camp.screenings.flatMap((s) => s.targetStandards));
  return GRADES.filter((g) => set.has(g));
}

/** "JKG – 12", "6 – 9", "8". */
export function standardsLabel(grades: Grade[]) {
  if (grades.length === 0) return "—";
  const first = grades[0];
  const last = grades[grades.length - 1];
  return first === last ? first : `${first} – ${last}`;
}

export function campDoctors(camp: Camp) {
  return [...new Set(camp.screenings.map((s) => s.leadDoctor))];
}

export function screeningTargets(screening: Screening, students: Student[]) {
  return students.filter((s) => s.status === "active" && screening.targetStandards.includes(s.grade));
}

/** Screenings done vs. expected across all of a camp's screenings. */
export function campProgress(camp: Camp, students: Student[]) {
  let done = 0;
  let expected = 0;
  for (const scr of camp.screenings) {
    done += scr.results.filter((r) => r.status !== "pending").length;
    expected += Math.max(scr.results.length, screeningTargets(scr, students).length);
  }
  return { done, expected };
}

export function campTargetsGrade(camp: Camp, grade: Grade) {
  return camp.screenings.some((s) => s.targetStandards.includes(grade));
}

/** Newest first by start date. */
export function sortCampsDesc(camps: Camp[]) {
  return [...camps].sort((a, b) => b.startDate.localeCompare(a.startDate));
}
