import { pushReportToHfiles } from "@/lib/data/report-sync";
import type { Report } from "@/lib/types/report";
import { actorName, newId, nowIso } from "../helpers";
import type { SliceCreator } from "../state";

export type UploadReportInput = Pick<Report, "studentId" | "fileName" | "category" | "size">;

export type ReportsSlice = {
  reports: Report[];
  /** Stores the report, then auto-pushes it to hfiles.in. Returns the new report. */
  uploadReport: (input: UploadReportInput) => Report;
  /** Pushes an existing, not-yet-synced report to the student's hfiles.in timeline. */
  syncReportToHfiles: (reportId: string) => void;
  deleteReport: (reportId: string, reason: string) => void;
};

export const createReportsSlice: SliceCreator<ReportsSlice> = (set, get) => ({
  reports: [],

  uploadReport: (input) => {
    const report: Report = {
      ...input,
      id: newId("rep"),
      uploadDate: nowIso(),
      uploadedBy: actorName(get()),
      syncedToHfiles: false,
    };
    set((s) => ({ reports: [report, ...s.reports] }));
    get().syncReportToHfiles(report.id);
    const name = get().students.find((s) => s.id === input.studentId)?.name ?? input.studentId;
    get().logAudit("report.uploaded", name, report.fileName);
    return { ...report, syncedToHfiles: true };
  },

  syncReportToHfiles: (reportId) => {
    const report = get().reports.find((r) => r.id === reportId);
    if (!report) return;
    const syncedAt = nowIso();
    set((s) => ({
      reports: s.reports.map((r) => (r.id === reportId ? { ...r, syncedToHfiles: true } : r)),
      students: s.students.map((st) =>
        st.id === report.studentId ? pushReportToHfiles(st, report, syncedAt, get().school.name) : st,
      ),
    }));
  },

  deleteReport: (reportId, reason) => {
    const report = get().reports.find((r) => r.id === reportId);
    set((s) => ({ reports: s.reports.filter((r) => r.id !== reportId) }));
    if (report) get().logAudit("report.deleted", report.fileName, reason);
  },
});
