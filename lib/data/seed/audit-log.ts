import type { AuditLogEntry } from "@/lib/types/audit-log";

/** Newest first. */
export const seedAuditLog: AuditLogEntry[] = [
  { id: "aud-04", actor: "Nurse Farah Siddiqui", action: "clinical-note.created", target: "Reyansh Gupta", reason: "Low blood sugar incident", timestamp: "2026-09-26T11:20:00Z" },
  { id: "aud-03", actor: "Nurse Chloe Simm", action: "clinical-note.created", target: "Alex Bennett", reason: "Allergic reaction at lunch", timestamp: "2026-09-24T12:40:00Z" },
  { id: "aud-02", actor: "Mr. Ankit Sharma", action: "camp.created", target: "Winter Screening 2026", reason: "Term 2 screening schedule", timestamp: "2026-09-01T08:00:00Z" },
  { id: "aud-01", actor: "Mr. Vikram Bose", action: "students.promoted", target: "Grades JKG–11 (2026–27)", reason: "Annual promotion", timestamp: "2026-04-01T09:00:00Z" },
];
