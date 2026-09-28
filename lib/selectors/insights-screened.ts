import type { Camp } from "@/lib/types/camp";
import type { Grade } from "@/lib/types/grade";
import type { Screening, ScreeningResult } from "@/lib/types/screening";
import type { Student } from "@/lib/types/student";

export type ScreenedRow = { student: Student; result: ScreeningResult };
export type ScreenedScreening = { screening: Screening; rows: ScreenedRow[] };
export type ScreenedDate = { date: string; screenings: ScreenedScreening[] };
export type ScreenedCamp = { camp: Camp; dates: ScreenedDate[]; studentCount: number };

/**
 * Current-year screenings grouped camp → date → screening. Pending and
 * archived (previous academic year) results are left out.
 */
export function screenedThisYear(camps: Camp[], students: Student[], year: number, grade: Grade | null) {
  const byId = new Map(students.filter((s) => !grade || s.grade === grade).map((s) => [s.id, s]));
  const all = new Set<string>();

  const groups: ScreenedCamp[] = camps
    .filter((c) => c.startDate.startsWith(String(year)))
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .map((camp) => {
      const campStudents = new Set<string>();
      const dates = new Map<string, ScreenedScreening[]>();
      for (const screening of camp.screenings) {
        const rows = screening.results
          .filter((r) => r.status !== "pending" && !r.archivedYear && byId.has(r.studentId))
          .map((r) => ({ student: byId.get(r.studentId)!, result: r }));
        if (rows.length === 0) continue;
        rows.forEach((r) => {
          campStudents.add(r.student.id);
          all.add(r.student.id);
        });
        dates.set(screening.date, [...(dates.get(screening.date) ?? []), { screening, rows }]);
      }
      return {
        camp,
        dates: [...dates.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, screenings]) => ({ date, screenings })),
        studentCount: campStudents.size,
      };
    })
    .filter((g) => g.dates.length > 0);

  return { groups, distinctStudents: all.size };
}
