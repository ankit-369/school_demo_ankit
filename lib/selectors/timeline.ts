import { REPORT_CATEGORY_LABELS, RESULT_STATUS, SCREENING_TYPE_LABELS, NOTE_TYPE_LABELS } from "@/lib/labels";
import type { Camp } from "@/lib/types/camp";
import type { ClinicalNote } from "@/lib/types/clinical-note";
import type { Report } from "@/lib/types/report";
import type { StatusTone } from "@/lib/types/status";
import type { Student } from "@/lib/types/student";
import { studentScreenings } from "./students";

export type TimelineKind = "note" | "report" | "screening" | "sync";

export type TimelineItem = {
  id: string;
  kind: TimelineKind;
  date: string;
  title: string;
  detail: string;
  tone?: StatusTone;
  toneLabel?: string;
};

type Input = { camps: Camp[]; notes: ClinicalNote[]; reports: Report[] };

/** Recent activity for one student across notes, screenings, reports and hfiles.in syncs. */
export function studentTimeline(student: Student, { camps, notes, reports }: Input, limit = 6): TimelineItem[] {
  const items: TimelineItem[] = [];

  notes
    .filter((n) => n.studentId === student.id)
    .forEach((n) =>
      items.push({
        id: n.id,
        kind: "note",
        date: n.dateTime,
        title: `${NOTE_TYPE_LABELS[n.type]} note by ${n.staffName}`,
        detail: n.notes,
        ...(n.urgent && { tone: "danger" as const, toneLabel: "Urgent" }),
      }),
    );

  studentScreenings(student, camps)
    .filter((row) => row.result && row.result.status !== "pending")
    .forEach(({ camp, screening, result }) =>
      items.push({
        id: `${screening.id}-${student.id}`,
        kind: "screening",
        date: screening.date,
        title: `${SCREENING_TYPE_LABELS[screening.type]} · ${camp.name}`,
        detail: result!.notes,
        tone: RESULT_STATUS[result!.status].tone,
        toneLabel: RESULT_STATUS[result!.status].label,
      }),
    );

  reports
    .filter((r) => r.studentId === student.id)
    .forEach((r) =>
      items.push({
        id: r.id,
        kind: "report",
        date: r.uploadDate,
        title: `${REPORT_CATEGORY_LABELS[r.category]} uploaded`,
        detail: `${r.fileName} · by ${r.uploadedBy}`,
      }),
    );

  const synced = student.medicalHistory.hfiles.lastSyncedAt;
  if (synced) {
    items.push({ id: `sync-${student.id}`, kind: "sync", date: synced, title: "Synced with hfiles.in", detail: "Health record refreshed from the family account." });
  }

  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
