import type { Camp } from "@/lib/types/camp";
import type { Grade } from "@/lib/types/grade";
import type { Report } from "@/lib/types/report";
import type { Student } from "@/lib/types/student";
import { campTargetsGrade } from "./camps";
import { hasHealthFlags } from "./students";

export type DashboardKpis = {
  totalStudents: number;
  totalCamps: number;
  screenedThisYear: number;
  reportsShared: number;
  pendingReports: number;
  medicalConditions: number;
};

type Input = { students: Student[]; camps: Camp[]; reports: Report[] };

/**
 * All six dashboard figures, optionally scoped to one grade.
 * - Screened: distinct students with a non-pending result in a camp this year
 * - Reports shared: screening reports issued + uploads synced to hfiles.in
 * - Pending: screening results still pending + uploads not yet synced
 * - Medical conditions: students with any allergy or condition on file
 */
export function dashboardKpis({ students, camps, reports }: Input, grade: Grade | null, year: number): DashboardKpis {
  const inScope = students.filter((s) => s.status === "active" && (!grade || s.grade === grade));
  const ids = new Set(inScope.map((s) => s.id));
  const scopedCamps = grade ? camps.filter((c) => campTargetsGrade(c, grade)) : camps;
  const results = scopedCamps.flatMap((c) => c.screenings.flatMap((s) => s.results)).filter((r) => ids.has(r.studentId));
  const thisYear = scopedCamps
    .filter((c) => c.startDate.startsWith(String(year)))
    .flatMap((c) => c.screenings.flatMap((s) => s.results));
  const scopedReports = reports.filter((r) => ids.has(r.studentId));

  return {
    totalStudents: inScope.length,
    totalCamps: scopedCamps.length,
    screenedThisYear: new Set(thisYear.filter((r) => r.status !== "pending" && ids.has(r.studentId)).map((r) => r.studentId)).size,
    reportsShared: results.filter((r) => r.reportUrl).length + scopedReports.filter((r) => r.syncedToHfiles).length,
    pendingReports: results.filter((r) => r.status === "pending").length + scopedReports.filter((r) => !r.syncedToHfiles).length,
    medicalConditions: inScope.filter(hasHealthFlags).length,
  };
}
