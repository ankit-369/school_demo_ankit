import type { CampPhase } from "@/lib/types/camp";
import type { ClinicalNoteType } from "@/lib/types/clinical-note";
import type { NotificationChannel, NotificationStatus, NotificationType } from "@/lib/types/notification";
import type { ReportCategory } from "@/lib/types/report";
import type { ScreeningResultStatus, ScreeningType } from "@/lib/types/screening";
import type { StatusTone } from "@/lib/types/status";
import type { StaffRole, StaffStatus } from "@/lib/types/staff";
import type { HearingStatus, StudentStatus } from "@/lib/types/student";

type ToneLabel = { tone: StatusTone; label: string };

export const SCREENING_TYPE_LABELS: Record<ScreeningType, string> = {
  vision: "Vision screening",
  dental: "Dental screening",
  hearing: "Hearing screening",
  anthropometry: "Anthropometry",
  general: "General physical exam",
  ent: "ENT screening",
};

export const RESULT_STATUS: Record<ScreeningResultStatus, ToneLabel> = {
  completed: { tone: "success", label: "Completed" },
  "follow-up": { tone: "warning", label: "Follow-up required" },
  pending: { tone: "neutral", label: "Pending" },
};

export const CAMP_PHASE: Record<CampPhase, ToneLabel> = {
  completed: { tone: "success", label: "Completed" },
  "in-progress": { tone: "warning", label: "In progress" },
  upcoming: { tone: "neutral", label: "Upcoming" },
};

export const STUDENT_STATUS: Record<StudentStatus, ToneLabel> = {
  active: { tone: "success", label: "Active" },
  graduated: { tone: "neutral", label: "Graduated" },
  transferred: { tone: "warning", label: "Transferred" },
  exited: { tone: "neutral", label: "Exited" },
};

export const HEARING_LABELS: Record<HearingStatus, string> = {
  normal: "Normal",
  "mild-loss": "Mild loss",
  "needs-review": "Needs review",
};

export const NOTE_TYPE_LABELS: Record<ClinicalNoteType, string> = {
  incident: "Incident",
  general: "General",
  screening: "Screening",
};

export const REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  lab: "Lab result",
  prescription: "Prescription",
  imaging: "Imaging",
  screening: "Screening report",
  vaccination: "Vaccination record",
  other: "Other document",
};

export const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  sms: "SMS",
  whatsapp: "WhatsApp",
};

export const NOTIFICATION_STATUS: Record<NotificationStatus, ToneLabel> = {
  queued: { tone: "neutral", label: "Queued" },
  sent: { tone: "neutral", label: "Sent" },
  delivered: { tone: "success", label: "Delivered" },
  failed: { tone: "danger", label: "Failed" },
};

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  principal: "Principal",
  admin: "Administrator",
  teacher: "Teacher",
  nurse: "Nurse",
  registrar: "Registrar",
};

export const STAFF_STATUS: Record<StaffStatus, ToneLabel> = {
  active: { tone: "success", label: "Active" },
  "on-leave": { tone: "warning", label: "On leave" },
  inactive: { tone: "neutral", label: "Inactive" },
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  "clinical-note": "Clinical note",
  "screening-result": "Screening result",
  "report-shared": "Report shared",
  "camp-reminder": "Camp reminder",
  "consent-request": "Consent request",
  "report-reminder": "Pending report reminder",
};
