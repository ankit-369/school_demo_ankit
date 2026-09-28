import { archivesEntries, nextAcademicYear, outcomeFor, type PlanCounts, type PromotionPlan } from "@/lib/academic/promotion-plan";
import type { Student } from "@/lib/types/student";
import { nowIso } from "../helpers";
import type { SliceCreator } from "../state";
import { classTeacher } from "../student-builder";

export type PromotionSummary = {
  fromYear: string;
  toYear: string;
  counts: PlanCounts;
  archived: { results: number; notes: number; reports: number };
};

export type AcademicSlice = {
  /** e.g. "2026-27". */
  academicYear: string;
  /**
   * Year-end rollover: applies each student's outcome, records the closed year
   * on their history, and marks promoted/graduating students' screening
   * results, notes and reports as archived (data kept, hidden by default).
   */
  runPromotion: (plan: PromotionPlan, reason: string) => PromotionSummary;
};

export const createAcademicSlice: SliceCreator<AcademicSlice> = (set, get) => ({
  academicYear: "2026-27",

  runPromotion: (plan, reason) => {
    const { academicYear: fromYear, staff } = get();
    const toYear = nextAcademicYear(fromYear);
    const closedAt = nowIso();
    const counts: PlanCounts = { promoted: 0, graduated: 0, retained: 0, transferred: 0, exited: 0 };
    const archiveIds = new Set<string>();

    const students = get().students.map((s): Student => {
      if (s.status !== "active") return s;
      const { outcome, toGrade } = outcomeFor(s, plan);
      counts[outcome]++;
      if (archivesEntries(outcome)) archiveIds.add(s.id);
      const history = [...(s.history ?? []), { year: fromYear, grade: s.grade, division: s.division, outcome, closedAt }];
      if (outcome === "promoted" && toGrade) {
        return { ...s, grade: toGrade, classTeacherId: classTeacher(staff, toGrade, s.division), history };
      }
      if (outcome === "graduated" || outcome === "transferred" || outcome === "exited") return { ...s, status: outcome, history };
      return { ...s, history }; // retained: same grade, new year
    });

    const archived = { results: 0, notes: 0, reports: 0 };
    const tag = <T extends { studentId: string; archivedYear?: string }>(item: T, key: keyof typeof archived): T => {
      if (!archiveIds.has(item.studentId) || item.archivedYear) return item;
      archived[key]++;
      return { ...item, archivedYear: fromYear };
    };

    set((st) => ({
      academicYear: toYear,
      students,
      camps: st.camps.map((c) => ({ ...c, screenings: c.screenings.map((scr) => ({ ...scr, results: scr.results.map((r) => tag(r, "results")) })) })),
      notes: st.notes.map((n) => tag(n, "notes")),
      reports: st.reports.map((r) => tag(r, "reports")),
    }));
    get().logAudit(
      "academic-year.promoted",
      `${fromYear} → ${toYear}`,
      `${reason} · ${counts.promoted} promoted, ${counts.graduated} graduated, ${counts.retained} retained, ${counts.transferred} transferred, ${counts.exited} exited`,
    );
    return { fromYear, toYear, counts, archived };
  },
});
