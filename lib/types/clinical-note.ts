export type ClinicalNoteType = "incident" | "general" | "screening";

export type GuardianNotification = {
  reason: string;
  actionTaken: string;
  suggestion: string;
  sentAt: string;
  status: "sent" | "delivered";
};

export type ClinicalNote = {
  id: string;
  studentId: string;
  type: ClinicalNoteType;
  dateTime: string;
  staffName: string;
  notes: string;
  urgent: boolean;
  notifyGuardian: boolean;
  notification?: GuardianNotification;
  /** Set when a promotion archived this entry, e.g. "2026-27". Data is kept; current views hide it by default. */
  archivedYear?: string;
};
