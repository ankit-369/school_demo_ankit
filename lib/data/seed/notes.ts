import type { ClinicalNote } from "@/lib/types/clinical-note";
import { studentId } from "./student-factory";

export const seedNotes: ClinicalNote[] = [
  {
    id: "note-01", studentId: studentId(16), type: "incident", dateTime: "2026-09-24T12:40:00Z",
    staffName: "Nurse Chloe Simm", urgent: true, notifyGuardian: true,
    notes: "Hives on forearms after lunch; suspected cross-contact with peanut. Antihistamine given, observed 60 min, EpiPen not required.",
    notification: {
      reason: "Mild allergic reaction at lunch",
      actionTaken: "Antihistamine given and observed for one hour",
      suggestion: "Please review lunch box contents and consult your allergist",
      sentAt: "2026-09-24T13:50:00Z",
      status: "delivered",
    },
  },
  {
    id: "note-02", studentId: studentId(5), type: "incident", dateTime: "2026-09-15T10:05:00Z",
    staffName: "Nurse Chloe Simm", urgent: false, notifyGuardian: true,
    notes: "Wheezing during PE. Two puffs of salbutamol; symptoms resolved in 10 min. Returned to class.",
    notification: {
      reason: "Asthma symptoms during PE",
      actionTaken: "Inhaler administered, symptoms resolved",
      suggestion: "Consider a pre-exercise dose on PE days",
      sentAt: "2026-09-15T10:30:00Z",
      status: "delivered",
    },
  },
  {
    id: "note-03", studentId: studentId(9), type: "incident", dateTime: "2026-09-26T11:20:00Z",
    staffName: "Nurse Farah Siddiqui", urgent: true, notifyGuardian: true,
    notes: "Blood glucose 62 mg/dL before recess. 15 g glucose tablets given, recheck 98 mg/dL after 15 min.",
    notification: {
      reason: "Low blood sugar before recess",
      actionTaken: "Glucose tablets given; level back to normal",
      suggestion: "Review morning insulin dose with your doctor",
      sentAt: "2026-09-26T11:45:00Z",
      status: "sent",
    },
  },
  {
    id: "note-04", studentId: studentId(4), type: "general", dateTime: "2026-09-22T09:10:00Z",
    staffName: "Nurse Chloe Simm", urgent: false, notifyGuardian: false,
    notes: "Class teacher informed about seating near the front following hearing screen result.",
  },
  {
    id: "note-05", studentId: studentId(11), type: "screening", dateTime: "2026-07-13T13:00:00Z",
    staffName: "Dr. Sarah Jenkins", urgent: false, notifyGuardian: false,
    notes: "Vision 6/12 both eyes. Squints at the board. Referred for refraction.",
  },
  {
    id: "note-06", studentId: studentId(25), type: "general", dateTime: "2026-09-18T14:30:00Z",
    staffName: "Nurse Chloe Simm", urgent: false, notifyGuardian: false,
    notes: "Migraine; rested in health centre 40 min with lights dimmed. Paracetamol per parental consent form.",
  },
];
