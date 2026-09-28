import type { ConsentRecord } from "@/lib/types/consent";
import { GRADES } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";
import { CAMP_IDS } from "./camps";

/** Deterministic pseudo-random spread of who has and hasn't signed. */
function pattern(students: Student[], everyNthPending: number): ConsentRecord["status"][] {
  return students.map((_, i) => (i % everyNthPending === 0 ? "pending" : "signed"));
}

/**
 * Three forms with different reach and completion, so /admin/consent shows a
 * real spread: a whole-school annual form, a camp-scoped dental form for
 * JKG-5, and a media-release form for the senior school.
 */
export function buildSeedConsent(students: Student[]): ConsentRecord[] {
  const active = students.filter((s) => s.status === "active");
  const juniors = active.filter((s) => GRADES.indexOf(s.grade) <= GRADES.indexOf("5"));
  const seniors = active.filter((s) => GRADES.indexOf(s.grade) >= GRADES.indexOf("9"));
  let seq = 0;
  const next = () => `cns-${String(++seq).padStart(3, "0")}`;

  const annual = active.map((s, i) => ({ id: next(), formName: "Annual Health Declaration 2026-27", studentId: s.id, status: pattern(active, 4)[i] }));
  const dental = juniors.map((s, i) => ({ id: next(), formName: "Winter Screening 2026 — dental consent", studentId: s.id, campId: CAMP_IDS.upcoming, status: pattern(juniors, 2)[i] }));
  const media = seniors.map((s, i) => ({ id: next(), formName: "Photo & media release", studentId: s.id, status: pattern(seniors, 3)[i] }));

  return [...annual, ...dental, ...media];
}
