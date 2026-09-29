import { composeGuardianMessage } from "@/lib/data/guardian-message";
import { can } from "@/lib/permissions";
import type { ClinicalNote } from "@/lib/types/clinical-note";
import type { NotificationChannel } from "@/lib/types/notification";
import { actorName, newId, nowIso } from "../helpers";
import type { SliceCreator } from "../state";

export type AddClinicalNoteInput = Pick<ClinicalNote, "studentId" | "type" | "urgent"> & {
  /** Internal note text; falls back to the guardian draft message when blank. */
  notes?: string;
  /** Structured guardian-message fields — present whenever this note might need a guardian told. */
  reason?: string;
  actionTaken?: string;
  suggestion?: string;
  /** Defaults to now. */
  dateTime?: string;
  /** The author can and chose to notify right away — only true for a teacher or admin (see lib/permissions.ts). */
  notifyNow?: boolean;
};

export type NotesSlice = {
  notes: ClinicalNote[];
  addClinicalNote: (input: AddClinicalNoteInput) => string;
  /** Sends the (possibly edited) draft message and marks the note notified. */
  notifyGuardianForNote: (noteId: string, message: string, channel: NotificationChannel) => void;
  markGuardianNotNeeded: (noteId: string, reason?: string) => void;
};

export const createNotesSlice: SliceCreator<NotesSlice> = (set, get) => {
  /** Shared by the "notify now" path on creation and the later notify-from-timeline action. */
  function deliverGuardianMessage(noteId: string, studentId: string, studentName: string, message: string, channel: NotificationChannel) {
    const notifiedAt = nowIso();
    const notifId = get().sendNotification({ studentId, type: "clinical-note", channel, message, createdAt: notifiedAt });
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === noteId ? { ...n, guardianStatus: "notified", notifiedBy: actorName(get()), notifiedAt, draftMessage: message } : n,
      ),
    }));
    get().logAudit("clinical-note.guardian-notified", studentName, "");
    window.setTimeout(() => get().markNotificationDelivered(notifId), 2000);
  }

  return {
    notes: [],

    addClinicalNote: ({ dateTime, reason, actionTaken, suggestion, notifyNow, ...input }) => {
      const id = newId("note");
      const createdAt = dateTime ?? nowIso();
      const student = get().students.find((s) => s.id === input.studentId);
      const name = student?.name ?? "Your child";
      const hasGuardianFields = Boolean((reason ?? "").trim() || (actionTaken ?? "").trim());
      const draftMessage = hasGuardianFields
        ? composeGuardianMessage(name, { reason: reason ?? "", actionTaken: actionTaken ?? "", suggestion: suggestion ?? "" }, get().school.name)
        : undefined;
      const wantsNotifyNow = Boolean(notifyNow && hasGuardianFields && can(get().role, "notifyGuardian"));

      const note: ClinicalNote = {
        ...input,
        id,
        dateTime: createdAt,
        staffName: actorName(get()),
        notes: input.notes?.trim() || draftMessage || "",
        reason,
        actionTaken,
        suggestion,
        draftMessage,
        guardianStatus: hasGuardianFields ? (wantsNotifyNow ? "notified" : "pending") : undefined,
      };

      set((s) => ({ notes: [note, ...s.notes] }));
      get().logAudit("clinical-note.created", name, input.urgent ? "Urgent" : "");
      if (wantsNotifyNow && draftMessage) deliverGuardianMessage(id, input.studentId, name, draftMessage, "whatsapp");
      return id;
    },

    notifyGuardianForNote: (noteId, message, channel) => {
      const note = get().notes.find((n) => n.id === noteId);
      if (!note) return;
      const name = get().students.find((s) => s.id === note.studentId)?.name ?? "Student";
      deliverGuardianMessage(noteId, note.studentId, name, message, channel);
    },

    markGuardianNotNeeded: (noteId, reason) => {
      const note = get().notes.find((n) => n.id === noteId);
      if (!note) return;
      set((s) => ({
        notes: s.notes.map((n) => (n.id === noteId ? { ...n, guardianStatus: "not-needed", notNeededReason: reason } : n)),
      }));
      const name = get().students.find((s) => s.id === note.studentId)?.name ?? "Student";
      get().logAudit("clinical-note.guardian-not-needed", name, reason ?? "");
    },
  };
};
