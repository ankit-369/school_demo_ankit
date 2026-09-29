"use client";

import { Send } from "lucide-react";
import { PendingGuardianNote } from "@/components/notes/pending-guardian-note";
import { ArchivedBadge } from "@/components/ui/archive-toggle";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDateTime } from "@/lib/format";
import { CHANNEL_LABELS, GUARDIAN_STATUS_LABELS, NOTE_TYPE_LABELS, NOTIFICATION_STATUS } from "@/lib/labels";
import { can } from "@/lib/permissions";
import { useAppStore } from "@/lib/store/app-store";
import type { ClinicalNote, GuardianStatus } from "@/lib/types/clinical-note";
import type { Notification } from "@/lib/types/notification";
import type { StatusTone } from "@/lib/types/status";

type NoteCardProps = { note: ClinicalNote; notification?: Notification; guardianName: string };

function guardianBadge(note: ClinicalNote): { tone: StatusTone; label: string } {
  if (note.guardianStatus === "notified") {
    return { tone: "success", label: `Notified by ${note.notifiedBy} on ${formatDate(note.notifiedAt ?? note.dateTime)}` };
  }
  return GUARDIAN_STATUS_LABELS[note.guardianStatus as Exclude<GuardianStatus, "notified">];
}

export function NoteCard({ note, notification, guardianName }: NoteCardProps) {
  const role = useAppStore((s) => s.role);
  const canNotify = can(role, "notifyGuardian");

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-line bg-canvas px-5 py-4">
      <header className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-6 items-center rounded-md bg-surface px-2 text-xs font-medium text-ink-soft ring-1 ring-line ring-inset">
          {NOTE_TYPE_LABELS[note.type]}
        </span>
        {note.urgent && <StatusBadge tone="danger" label="Urgent" />}
        {note.archivedYear && <ArchivedBadge year={note.archivedYear} />}
        <span className="ml-auto text-[13px] text-ink-faint">
          <time dateTime={note.dateTime}>{formatDateTime(note.dateTime)}</time> · {note.staffName}
        </span>
      </header>
      <p className="text-[15px] leading-6 whitespace-pre-line text-ink">{note.notes}</p>

      {note.guardianStatus && (
        <div className="flex flex-col gap-2">
          <StatusBadge {...guardianBadge(note)} className="w-fit" />

          {note.guardianStatus === "notified" && (
            <div className="flex flex-col gap-1.5 rounded-lg bg-surface px-4 py-3">
              <p className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-ink-soft">
                <Send aria-hidden className="size-3.5 text-ink-faint" />
                Sent via {notification ? CHANNEL_LABELS[notification.channel] : "WhatsApp"}
                {notification && <StatusBadge {...NOTIFICATION_STATUS[notification.status]} className="h-5" />}
              </p>
              {notification && <p className="text-sm text-ink-soft">{notification.message}</p>}
            </div>
          )}

          {note.guardianStatus === "not-needed" && note.notNeededReason && (
            <p className="text-[13px] text-ink-faint">{note.notNeededReason}</p>
          )}

          {note.guardianStatus === "pending" && canNotify && (
            <PendingGuardianNote note={note} guardianName={guardianName} />
          )}
        </div>
      )}
    </article>
  );
}
