"use client";

import { MessageSquareWarning } from "lucide-react";
import { PendingGuardianNote } from "@/components/notes/pending-guardian-note";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { formatRelative } from "@/lib/format";
import { classKey } from "@/lib/types/grade";
import { usePendingVisits } from "./use-pending-visits";

/** Nurse visits for this teacher's students that still need a guardian told — the whole point of the pending workflow. */
export function PendingVisitsSection() {
  const items = usePendingVisits();
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
      <header className="flex items-center gap-2">
        <MessageSquareWarning aria-hidden className="size-4 shrink-0 text-warning" />
        <h2 className="text-[15px] font-semibold text-ink">Visits to share with guardians ({items.length})</h2>
      </header>
      <ul className="flex flex-col gap-3">
        {items.map(({ note, student }) => (
          <li key={note.id} className="flex flex-col gap-3 rounded-lg border border-line bg-canvas p-4">
            <div className="flex items-center gap-3">
              <StudentAvatar name={student.name} photoUrl={student.photoUrl} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-ink">{student.name}</p>
                <p className="text-[13px] text-ink-faint">
                  {classKey(student.grade, student.division)} · {formatRelative(note.dateTime)} · from {note.staffName}
                </p>
              </div>
            </div>
            <p className="text-sm text-ink-soft">{note.notes}</p>
            <PendingGuardianNote note={note} guardianName={student.guardian.name} />
          </li>
        ))}
      </ul>
    </section>
  );
}
