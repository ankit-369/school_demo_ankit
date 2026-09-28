import type { Camp } from "@/lib/types/camp";
import type { Grade } from "@/lib/types/grade";
import type { Report } from "@/lib/types/report";
import type { Student } from "@/lib/types/student";
import { campTargetsGrade } from "./camps";
import { flaggedCount } from "./insights-conditions";
import { pendingItems, sharedItems } from "./insights-reports";
import { screenedThisYear } from "./insights-screened";

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
 * All six dashboard figures, optionally scoped to one grade. Each one is
 * computed by the same selector its /admin/insights page lists, so a tile's
 * number always equals the rows behind it.
 */
export function dashboardKpis(input: Input, grade: Grade | null, year: number): DashboardKpis {
  const { students, camps } = input;
  return {
    totalStudents: students.filter((s) => s.status === "active" && (!grade || s.grade === grade)).length,
    totalCamps: (grade ? camps.filter((c) => campTargetsGrade(c, grade)) : camps).length,
    screenedThisYear: screenedThisYear(camps, students, year, grade).distinctStudents,
    reportsShared: sharedItems(input, grade).length,
    pendingReports: pendingItems(input, [], grade).length,
    medicalConditions: flaggedCount(students, grade),
  };
}
