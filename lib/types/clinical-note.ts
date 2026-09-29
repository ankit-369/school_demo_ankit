export type ClinicalNoteType = "incident" | "general" | "screening";

/**
 * Only a class teacher or admin can message a guardian (see lib/permissions.ts).
 * A note the nurse (or another `addNotes`-only role) writes starts "pending" and
 * waits for one of them to act on it from the student's Notes tab or, for a
 * teacher, from "Visits to share with guardians" on their class page.
 */
export type GuardianStatus = "pending" | "notified" | "not-needed";

export type ClinicalNote = {
  id: string;
  studentId: string;
  type: ClinicalNoteType;
  dateTime: string;
  staffName: string;
  /** Internal note, always shown on the timeline. */
  notes: string;
  urgent: boolean;
  /** Structured guardian-message fields, captured whenever a guardian might need telling. */
  reason?: string;
  actionTaken?: string;
  suggestion?: string;
  /** Auto-composed from reason/actionTaken/suggestion; editable by whoever notifies. */
  draftMessage?: string;
  /** Set only when reason/actionTaken were captured — a note with neither never enters this workflow. */
  guardianStatus?: GuardianStatus;
  notifiedBy?: string;
  notifiedAt?: string;
  notNeededReason?: string;
  /** Set when a promotion archived this entry, e.g. "2026-27". Data is kept; current views hide it by default. */
  archivedYear?: string;
  /** Set the first time the note's own text is edited after creation. */
  editedAt?: string;
};
