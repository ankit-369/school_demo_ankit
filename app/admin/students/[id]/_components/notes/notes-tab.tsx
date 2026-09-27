"use client";

import { NotebookPen } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { useAppStore } from "@/lib/store/app-store";
import { useCurrentStudent } from "../student-context";
import { AddNoteDialog } from "./add-note/add-note-dialog";
import { NoteCard } from "./note-card";

export function NotesTab() {
  const student = useCurrentStudent();
  const allNotes = useAppStore((s) => s.notes);
  const notifications = useAppStore((s) => s.notifications);
  const notes = useMemo(
    () => allNotes.filter((n) => n.studentId === student.id).sort((a, b) => b.dateTime.localeCompare(a.dateTime)),
    [allNotes, student.id],
  );

  /** Match a note to the notification it produced (same student, sent at the same moment). */
  const notificationFor = (sentAt?: string) =>
    sentAt ? notifications.find((n) => n.studentId === student.id && n.type === "clinical-note" && n.createdAt === sentAt) : undefined;

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading title="Clinical notes" actions={<AddNoteDialog student={student} />} />
      {notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line">
          <EmptyState icon={NotebookPen} title="No notes yet" description="Medical-room visits and incidents are recorded here." />
        </div>
      ) : (
        <ol className="flex flex-col gap-3">
          {notes.map((n) => (
            <li key={n.id}>
              <NoteCard note={n} notification={notificationFor(n.notification?.sentAt)} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
