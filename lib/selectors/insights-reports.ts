import { REPORT_CATEGORY_LABELS, SCREENING_TYPE_LABELS } from "@/lib/labels";
import type { Camp } from "@/lib/types/camp";
import type { Grade } from "@/lib/types/grade";
import type { Notification } from "@/lib/types/notification";
import type { Report } from "@/lib/types/report";
import type { Student } from "@/lib/types/student";
import { hfilesEntryId } from "./screening-results";

type Input = { students: Student[]; camps: Camp[]; reports: Report[] };

export type SharedItem = {
  id: string;
  kind: "upload" | "screening";
  student: Student;
  title: string;
  detail: string;
  sharedAt: string;
};

export type PendingItem = {
  id: string;
  kind: "screening" | "upload";
  student: Student;
  title: string;
  detail: string;
  /** Screening date, or upload date. */
  since: string;
  reportId?: string;
  campName?: string;
  /** Latest reminder sent for this item, if any. */
  remindedAt?: string;
};

function inScope(students: Student[], grade: Grade | null) {
  return new Map(students.filter((s) => !grade || s.grade === grade).map((s) => [s.id, s]));
}

/** Reports and screening results that reached families via hfiles.in, newest first. */
export function sharedItems({ students, camps, reports }: Input, grade: Grade | null): SharedItem[] {
  const scope = inScope(students, grade);
  const items: SharedItem[] = reports
    .filter((r) => r.syncedToHfiles && !r.archivedYear && scope.has(r.studentId))
    .map((r) => ({
      id: r.id,
      kind: "upload",
      student: scope.get(r.studentId)!,
      title: r.fileName,
      detail: `${REPORT_CATEGORY_LABELS[r.category]} · uploaded by ${r.uploadedBy}`,
      sharedAt: r.uploadDate,
    }));

  for (const camp of camps) {
    for (const scr of camp.screenings) {
      for (const res of scr.results) {
        const student = scope.get(res.studentId);
        const entry = student?.medicalHistory.hfiles.labReports.find((l) => l.id === hfilesEntryId(scr.id, res.studentId));
        if (!student || !entry || res.archivedYear) continue;
        items.push({
          id: entry.id,
          kind: "screening",
          student,
          title: `${SCREENING_TYPE_LABELS[scr.type]} result`,
          detail: `${camp.name} · ${scr.leadDoctor}`,
          sharedAt: entry.sharedAt ?? scr.date,
        });
      }
    }
  }
  return items.sort((a, b) => b.sharedAt.localeCompare(a.sharedAt));
}

export function pendingItemId(screeningId: string, studentId: string) {
  return `pend-${screeningId}-${studentId}`;
}

/** Outstanding work: screening results not yet recorded, and uploads not yet on hfiles.in. */
export function pendingItems({ students, camps, reports }: Input, notifications: Notification[], grade: Grade | null): PendingItem[] {
  const scope = inScope(students, grade);
  const lastReminder = new Map<string, string>();
  notifications.forEach((n) => {
    if (n.refId && (!lastReminder.has(n.refId) || n.createdAt > lastReminder.get(n.refId)!)) lastReminder.set(n.refId, n.createdAt);
  });

  const items: PendingItem[] = [];
  for (const camp of camps) {
    for (const scr of camp.screenings) {
      for (const res of scr.results) {
        const student = scope.get(res.studentId);
        if (!student || res.status !== "pending" || res.archivedYear) continue;
        const id = pendingItemId(scr.id, student.id);
        items.push({ id, kind: "screening", student, title: SCREENING_TYPE_LABELS[scr.type], detail: `${camp.name} · ${scr.leadDoctor}`, since: scr.date, campName: camp.name, remindedAt: lastReminder.get(id) });
      }
    }
  }
  reports
    .filter((r) => !r.syncedToHfiles && !r.archivedYear && scope.has(r.studentId))
    .forEach((r) =>
      items.push({ id: r.id, kind: "upload", student: scope.get(r.studentId)!, title: r.fileName, detail: `${REPORT_CATEGORY_LABELS[r.category]} · not yet on hfiles.in`, since: r.uploadDate, reportId: r.id }),
    );
  return items.sort((a, b) => a.since.localeCompare(b.since));
}
