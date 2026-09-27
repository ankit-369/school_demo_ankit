import { Send } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import { CHANNEL_LABELS, NOTE_TYPE_LABELS, NOTIFICATION_STATUS } from "@/lib/labels";
import type { ClinicalNote } from "@/lib/types/clinical-note";
import type { Notification } from "@/lib/types/notification";

type NoteCardProps = { note: ClinicalNote; notification?: Notification };

export function NoteCard({ note, notification }: NoteCardProps) {
  const sent = note.notification;
  const status = notification?.status ?? sent?.status;
  const message = notification?.message ?? (sent ? `${sent.reason}. ${sent.actionTaken}. ${sent.suggestion}.` : "");

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-line bg-canvas px-5 py-4">
      <header className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-6 items-center rounded-md bg-surface px-2 text-xs font-medium text-ink-soft ring-1 ring-line ring-inset">
          {NOTE_TYPE_LABELS[note.type]}
        </span>
        {note.urgent && <StatusBadge tone="danger" label="Urgent" />}
        <span className="ml-auto text-[13px] text-ink-faint">
          <time dateTime={note.dateTime}>{formatDateTime(note.dateTime)}</time> · {note.staffName}
        </span>
      </header>
      <p className="text-[15px] leading-6 whitespace-pre-line text-ink">{note.notes}</p>
      {sent && (
        <div className="flex flex-col gap-1.5 rounded-lg bg-surface px-4 py-3">
          <p className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-ink-soft">
            <Send aria-hidden className="size-3.5 text-ink-faint" />
            Guardian notified{notification ? ` via ${CHANNEL_LABELS[notification.channel]}` : ""}
            {status && <StatusBadge {...NOTIFICATION_STATUS[status]} className="h-5" />}
          </p>
          {message !== note.notes && <p className="text-sm text-ink-soft">{message}</p>}
        </div>
      )}
    </article>
  );
}
