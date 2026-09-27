import type { ConsentRecord } from "@/lib/types/consent";
import { GRADES } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";
import { CAMP_IDS } from "./camps";

/** Winter Screening dental consent for JKG–5; roughly half signed so far. */
export function buildSeedConsent(students: Student[]): ConsentRecord[] {
  const maxIndex = GRADES.indexOf("5");
  const juniors = students.filter((s) => GRADES.indexOf(s.grade) <= maxIndex);
  return juniors.map((s, i) => ({
    id: `cns-${String(i + 1).padStart(2, "0")}`,
    formName: "Winter Screening 2026 — dental consent",
    studentId: s.id,
    campId: CAMP_IDS.upcoming,
    status: i % 2 === 0 ? "signed" : "pending",
  }));
}
