import { REPORT_CATEGORY_LABELS } from "@/lib/labels";
import type { LabReport } from "@/lib/types/medical-history";
import type { Report } from "@/lib/types/report";
import type { Student } from "@/lib/types/student";

export function reportToLabEntry(report: Report): LabReport {
  return {
    id: `lab-${report.id}`,
    name: report.fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
    date: report.uploadDate,
    lab: "Shanti Asiatic School",
    summary: `${REPORT_CATEGORY_LABELS[report.category]} uploaded by ${report.uploadedBy}.`,
    reportId: report.id,
  };
}

/**
 * Simulates the hfiles.in auto-push: adds the report to the student's hfiles
 * timeline (idempotently) and bumps lastSyncedAt.
 */
export function pushReportToHfiles(student: Student, report: Report, syncedAt: string): Student {
  const { hfiles } = student.medicalHistory;
  if (hfiles.labReports.some((l) => l.reportId === report.id)) return student;
  const lastSyncedAt =
    hfiles.lastSyncedAt && hfiles.lastSyncedAt > syncedAt ? hfiles.lastSyncedAt : syncedAt;
  return {
    ...student,
    medicalHistory: {
      ...student.medicalHistory,
      hfiles: {
        ...hfiles,
        labReports: [reportToLabEntry(report), ...hfiles.labReports],
        lastSyncedAt,
      },
    },
  };
}
