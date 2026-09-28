import { classKey, GRADES, type ClassKey, type Grade } from "@/lib/types/grade";
import type { Student, YearOutcome } from "@/lib/types/student";

export type ClassTarget = Grade | "graduate";
export type ExceptionOutcome = "retain" | "transfer" | "exit";

export type PromotionPlan = {
  /** Target per class; missing classes use the suggested next grade. */
  targets: Partial<Record<ClassKey, ClassTarget>>;
  /** Per-student overrides of the class target. */
  exceptions: Record<string, ExceptionOutcome>;
};

/** "Next grade up", or graduation after Grade 12. */
export function suggestedTarget(grade: Grade): ClassTarget {
  return GRADES[GRADES.indexOf(grade) + 1] ?? "graduate";
}

export function targetFor(student: Student, plan: PromotionPlan): ClassTarget {
  return plan.targets[classKey(student.grade, student.division)] ?? suggestedTarget(student.grade);
}

export type StudentOutcome = { outcome: YearOutcome; toGrade: Grade | null };

/** What happens to one active student under the plan. */
export function outcomeFor(student: Student, plan: PromotionPlan): StudentOutcome {
  const exception = plan.exceptions[student.id];
  if (exception === "retain") return { outcome: "retained", toGrade: student.grade };
  if (exception === "transfer") return { outcome: "transferred", toGrade: null };
  if (exception === "exit") return { outcome: "exited", toGrade: null };
  const target = targetFor(student, plan);
  return target === "graduate" ? { outcome: "graduated", toGrade: null } : { outcome: "promoted", toGrade: target };
}

/** Promoted and graduating students have their prior-year entries archived. */
export function archivesEntries(outcome: YearOutcome) {
  return outcome === "promoted" || outcome === "graduated";
}

export type PlanCounts = Record<YearOutcome, number>;

export function planCounts(students: Student[], plan: PromotionPlan): PlanCounts {
  const counts: PlanCounts = { promoted: 0, graduated: 0, retained: 0, transferred: 0, exited: 0 };
  students.filter((s) => s.status === "active").forEach((s) => counts[outcomeFor(s, plan).outcome]++);
  return counts;
}

/** "2026-27" → "2027-28". */
export function nextAcademicYear(year: string) {
  const start = Number(year.slice(0, 4)) + 1;
  return `${start}-${String(start + 1).slice(-2)}`;
}

/** "2026-27" → "2026–27" for display. */
export function yearLabel(year: string) {
  return year.replace("-", "–");
}
