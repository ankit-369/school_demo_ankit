import { DEFAULT_SCHOOL_NAME } from "@/lib/config";
import { composeGuardianMessage } from "@/lib/data/guardian-message";
import type { ClinicalNote } from "@/lib/types/clinical-note";
import { studentId } from "./student-factory";

/** Builds the same draft message the app would, so seed data matches what the UI generates. */
function draft(name: string, reason: string, actionTaken: string, suggestion: string) {
  return composeGuardianMessage(name, { reason, actionTaken, suggestion }, DEFAULT_SCHOOL_NAME);
}

export const seedNotes: ClinicalNote[] = [
  {
    // Alex Bennett, 8-B — in Ms. Helena Vance's class: the demo's first pending visit.
    id: "note-01", studentId: studentId(16), type: "incident", dateTime: "2026-09-24T12:40:00Z",
    staffName: "Nurse Chloe Simm", urgent: true,
    notes: "Hives on forearms after lunch; suspected cross-contact with peanut. Antihistamine given, observed 60 min, EpiPen not required.",
    reason: "a mild allergic reaction",
    actionTaken: "Antihistamine given and observed for one hour",
    suggestion: "Please review lunch box contents and consult your allergist",
    draftMessage: draft("Alex Bennett", "a mild allergic reaction", "Antihistamine given and observed for one hour", "Please review lunch box contents and consult your allergist"),
    guardianStatus: "pending",
  },
  {
    // Kabir Singh, 1-A — Ms. Priya Nair's class. Already notified, delivered.
    id: "note-02", studentId: studentId(5), type: "incident", dateTime: "2026-09-15T10:05:00Z",
    staffName: "Nurse Chloe Simm", urgent: false,
    notes: "Wheezing during PE. Two puffs of salbutamol; symptoms resolved in 10 min. Returned to class.",
    reason: "asthma symptoms during PE",
    actionTaken: "Inhaler administered, symptoms resolved",
    suggestion: "Consider a pre-exercise dose on PE days",
    draftMessage: draft("Kabir Singh", "asthma symptoms during PE", "Inhaler administered, symptoms resolved", "Consider a pre-exercise dose on PE days"),
    guardianStatus: "notified",
    notifiedBy: "Ms. Priya Nair",
    notifiedAt: "2026-09-15T10:30:00Z",
  },
  {
    // Reyansh Gupta, 4-A — Mr. Rohan Kapoor's class. Notified, still just "sent".
    id: "note-03", studentId: studentId(9), type: "incident", dateTime: "2026-09-26T11:20:00Z",
    staffName: "Nurse Farah Siddiqui", urgent: true,
    notes: "Blood glucose 62 mg/dL before recess. 15 g glucose tablets given, recheck 98 mg/dL after 15 min.",
    reason: "low blood sugar before recess",
    actionTaken: "Glucose tablets given; level back to normal",
    suggestion: "Review morning insulin dose with your doctor",
    draftMessage: draft("Reyansh Gupta", "low blood sugar before recess", "Glucose tablets given; level back to normal", "Review morning insulin dose with your doctor"),
    guardianStatus: "notified",
    notifiedBy: "Mr. Rohan Kapoor",
    notifiedAt: "2026-09-26T11:45:00Z",
  },
  {
    id: "note-04", studentId: studentId(4), type: "general", dateTime: "2026-09-22T09:10:00Z",
    staffName: "Nurse Chloe Simm", urgent: false,
    notes: "Class teacher informed about seating near the front following hearing screen result.",
  },
  {
    id: "note-05", studentId: studentId(11), type: "screening", dateTime: "2026-07-13T13:00:00Z",
    staffName: "Dr. Sarah Jenkins", urgent: false,
    notes: "Vision 6/12 both eyes. Squints at the board. Referred for refraction.",
  },
  {
    // Meera Pillai, 12-A — also Ms. Helena Vance's class: the demo's second pending visit.
    id: "note-06", studentId: studentId(25), type: "general", dateTime: "2026-09-18T14:30:00Z",
    staffName: "Nurse Chloe Simm", urgent: false,
    notes: "Migraine; rested in health centre 40 min with lights dimmed. Paracetamol per parental consent form.",
    reason: "a migraine",
    actionTaken: "Rested in the health centre for 40 minutes with the lights dimmed; paracetamol given per her consent form",
    suggestion: "",
    draftMessage: draft("Meera Pillai", "a migraine", "Rested in the health centre for 40 minutes with the lights dimmed; paracetamol given per her consent form", ""),
    guardianStatus: "pending",
  },
];
