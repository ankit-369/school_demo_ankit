import type { Notification } from "@/lib/types/notification";
import { studentId } from "./student-factory";

export const seedNotifications: Notification[] = [
  { id: "ntf-01", studentId: studentId(16), type: "clinical-note", channel: "whatsapp", status: "delivered", createdAt: "2026-09-24T13:50:00Z", message: "Alex had a mild allergic reaction at lunch. Antihistamine given and he is fine. Please review lunch box contents." },
  { id: "ntf-02", studentId: studentId(5), type: "clinical-note", channel: "sms", status: "delivered", createdAt: "2026-09-15T10:30:00Z", message: "Kabir had asthma symptoms during PE. Inhaler given, symptoms resolved." },
  { id: "ntf-03", studentId: studentId(9), type: "clinical-note", channel: "whatsapp", status: "sent", createdAt: "2026-09-26T11:45:00Z", message: "Reyansh had low blood sugar before recess. Glucose tablets given; level back to normal." },
  { id: "ntf-04", studentId: studentId(16), type: "screening-result", channel: "whatsapp", status: "delivered", createdAt: "2026-07-16T15:00:00Z", message: "Dental screening: two cavities detected. Please book a dental visit within 4 weeks." },
  { id: "ntf-05", studentId: studentId(4), type: "screening-result", channel: "sms", status: "delivered", createdAt: "2026-09-22T16:00:00Z", message: "Hearing screening: audiology referral recommended for Diya." },
  { id: "ntf-06", studentId: studentId(1), type: "consent-request", channel: "whatsapp", status: "sent", createdAt: "2026-09-25T09:00:00Z", message: "Please sign the consent form for Winter Screening 2026 (dental)." },
];
