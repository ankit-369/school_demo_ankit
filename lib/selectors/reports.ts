import type { Report, ReportCategory } from "@/lib/types/report";
import type { Student } from "@/lib/types/student";

export type ReportRow = { report: Report; student: Student };

export type ReportsFilter = {
  query: string;
  category: ReportCategory | "";
  from: string;
  to: string;
  showArchived: boolean;
};

export const EMPTY_REPORTS_FILTER: ReportsFilter = { query: "", category: "", from: "", to: "", showArchived: false };

/** Every uploaded report joined to its student, newest first, with the directory's own filters. */
export function allReportRows(reports: Report[], students: Student[], f: ReportsFilter): ReportRow[] {
  const byId = new Map(students.map((s) => [s.id, s]));
  const q = f.query.trim().toLowerCase();

  return reports
    .map((report) => ({ report, student: byId.get(report.studentId) }))
    .filter((r): r is ReportRow => Boolean(r.student))
    .filter(({ report, student }) => {
      if (!f.showArchived && report.archivedYear) return false;
      if (f.category && report.category !== f.category) return false;
      if (f.from && report.uploadDate.slice(0, 10) < f.from) return false;
      if (f.to && report.uploadDate.slice(0, 10) > f.to) return false;
      if (q && ![student.name, student.hfid, report.fileName].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    })
    .sort((a, b) => b.report.uploadDate.localeCompare(a.report.uploadDate));
}
