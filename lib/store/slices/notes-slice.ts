import type { ClinicalNote, GuardianNotification } from "@/lib/types/clinical-note";
import type { NotificationChannel } from "@/lib/types/notification";
import { actorName, newId, nowIso } from "../helpers";
import type { SliceCreator } from "../state";

export type AddClinicalNoteInput = Pick<ClinicalNote, "studentId" | "type" | "notes" | "urgent"> & {
  /** Defaults to now. */
  dateTime?: string;
  /** When present, the guardian is notified and the message is recorded on the note. */
  guardianMessage?: Pick<GuardianNotification, "reason" | "actionTaken" | "suggestion"> & {
    channel: NotificationChannel;
  };
};

export type NotesSlice = {
  notes: ClinicalNote[];
  addClinicalNote: (input: AddClinicalNoteInput) => string;
};

export const createNotesSlice: SliceCreator<NotesSlice> = (set, get) => ({
  notes: [],

  addClinicalNote: ({ guardianMessage, dateTime, ...input }) => {
    const id = newId("note");
    const sentAt = nowIso();
    const note: ClinicalNote = {
      ...input,
      id,
      dateTime: dateTime ?? sentAt,
      staffName: actorName(get()),
      notifyGuardian: Boolean(guardianMessage),
    };

    if (guardianMessage) {
      const { channel, ...message } = guardianMessage;
      note.notification = { ...message, sentAt, status: "sent" };
      get().sendNotification({
        studentId: input.studentId,
        type: "clinical-note",
        channel,
        message: [message.reason, message.actionTaken, message.suggestion]
          .map((part) => part.trim().replace(/[.\s]+$/, ""))
          .filter(Boolean)
          .join(". ")
          .concat("."),
      });
    }

    set((s) => ({ notes: [note, ...s.notes] }));
    const name = get().students.find((s) => s.id === input.studentId)?.name ?? input.studentId;
    get().logAudit("clinical-note.created", name, input.urgent ? "Urgent" : "");
    return id;
  },
});
