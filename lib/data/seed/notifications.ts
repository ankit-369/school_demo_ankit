import { DEFAULT_SCHOOL_NAME } from "@/lib/config";
import { composeGuardianMessage } from "@/lib/data/guardian-message";
import type { Notification } from "@/lib/types/notification";
import { studentId } from "./student-factory";

const kabirMessage = composeGuardianMessage(
  "Kabir Singh",
  { reason: "asthma symptoms during PE", actionTaken: "Inhaler administered, symptoms resolved", suggestion: "Consider a pre-exercise dose on PE days" },
  DEFAULT_SCHOOL_NAME,
);
const reyanshMessage = composeGuardianMessage(
  "Reyansh Gupta",
  { reason: "low blood sugar before recess", actionTaken: "Glucose tablets given; level back to normal", suggestion: "Review morning insulin dose with your doctor" },
  DEFAULT_SCHOOL_NAME,
);

export const seedNotifications: Notification[] = [
  // Matches note-02's notifiedAt — the message a class teacher sent for a nurse's visit.
  { id: "ntf-02", studentId: studentId(5), type: "clinical-note", channel: "sms", status: "delivered", createdAt: "2026-09-15T10:30:00Z", message: kabirMessage, sentBy: "Ms. Priya Nair" },
  // Matches note-03's notifiedAt.
  { id: "ntf-03", studentId: studentId(9), type: "clinical-note", channel: "whatsapp", status: "sent", createdAt: "2026-09-26T11:45:00Z", message: reyanshMessage, sentBy: "Mr. Rohan Kapoor" },
  { id: "ntf-04", studentId: studentId(16), type: "screening-result", channel: "whatsapp", status: "delivered", createdAt: "2026-07-16T15:00:00Z", message: "Dental screening: two cavities detected. Please book a dental visit within 4 weeks.", sentBy: "Nurse Chloe Simm" },
  { id: "ntf-05", studentId: studentId(4), type: "screening-result", channel: "sms", status: "delivered", createdAt: "2026-09-22T16:00:00Z", message: "Hearing screening: audiology referral recommended for Diya.", sentBy: "Nurse Chloe Simm" },
  { id: "ntf-06", studentId: studentId(1), type: "consent-request", channel: "whatsapp", status: "sent", createdAt: "2026-09-25T09:00:00Z", message: "Please sign the consent form for Winter Screening 2026 (dental).", sentBy: "Mr. Ankit Sharma" },
];
