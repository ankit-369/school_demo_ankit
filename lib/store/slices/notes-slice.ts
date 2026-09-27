import { composeGuardianMessage, type GuardianMessageParts } from "@/lib/data/guardian-message";
import type { ClinicalNote } from "@/lib/types/clinical-note";
import type { NotificationChannel } from "@/lib/types/notification";
import { actorName, newId, nowIso } from "../helpers";
import type { SliceCreator } from "../state";

export type AddClinicalNoteInput = Pick<ClinicalNote, "studentId" | "type" | "notes" | "urgent"> & {
  /** Defaults to now. */
  dateTime?: string;
  /** When present, the guardian is notified and the message is recorded on the note. */
  guardianMessage?: GuardianMessageParts & { channel: NotificationChannel };
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
    const name = get().students.find((s) => s.id === input.studentId)?.name ?? "Your child";
    const note: ClinicalNote = {
      ...input,
      id,
      dateTime: dateTime ?? sentAt,
      staffName: actorName(get()),
      notifyGuardian: Boolean(guardianMessage),
    };

    if (guardianMessage) {
      const { channel, ...parts } = guardianMessage;
      note.notification = { ...parts, sentAt, status: "sent" };
      get().sendNotification({
        studentId: input.studentId,
        type: "clinical-note",
        channel,
        createdAt: sentAt,
        message: composeGuardianMessage(name, parts),
      });
    }

    set((s) => ({ notes: [note, ...s.notes] }));
    get().logAudit("clinical-note.created", name, input.urgent ? "Urgent" : "");
    return id;
  },
});
