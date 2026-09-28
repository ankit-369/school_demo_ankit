import type { DemoData } from "@/lib/store/state";
import { pushReportToHfiles } from "../report-sync";
import { seedAuditLog } from "./audit-log";
import { buildSeedCamps } from "./camps";
import { buildSeedConsent } from "./consent";
import { seedDoctorLinks } from "./doctor-links";
import { seedNotes } from "./notes";
import { seedNotifications } from "./notifications";
import { seedReports } from "./reports";
import { seedStaff } from "./staff";
import { makeStudent } from "./student-factory";
import { juniorStudentSeeds } from "./students-junior";
import { seniorStudentSeeds } from "./students-senior";

/** Builds a fresh, deep copy of the demo dataset on every call. */
export function createSeedData(): DemoData {
  const syncedReports = seedReports.filter((r) => r.syncedToHfiles);
  const students = [...juniorStudentSeeds, ...seniorStudentSeeds]
    .map(makeStudent)
    // Keep seed consistent with uploadReport: synced reports appear on the hfiles timeline.
    .map((s) =>
      syncedReports
        .filter((r) => r.studentId === s.id)
        .reduce((acc, r) => pushReportToHfiles(acc, r, r.uploadDate), s),
    );

  return structuredClone({
    students,
    staff: seedStaff,
    camps: buildSeedCamps(students),
    notes: seedNotes,
    reports: seedReports,
    notifications: seedNotifications,
    consents: buildSeedConsent(students),
    auditLog: seedAuditLog,
    doctorLinks: seedDoctorLinks,
  });
}
