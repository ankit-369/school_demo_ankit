import type { Student } from "@/lib/types/student";

export type SyncRow = { student: Student; syncedAt: string };

/** Students with an hfiles.in sync, most recent first — the log pulled straight from lastSyncedAt. */
export function recentSyncs(students: Student[], limit = 20): SyncRow[] {
  return students
    .filter((s): s is Student & { medicalHistory: { hfiles: { lastSyncedAt: string } } } => Boolean(s.medicalHistory.hfiles.lastSyncedAt))
    .map((s) => ({ student: s, syncedAt: s.medicalHistory.hfiles.lastSyncedAt as string }))
    .sort((a, b) => b.syncedAt.localeCompare(a.syncedAt))
    .slice(0, limit);
}

export function connectionStats(students: Student[]) {
  const active = students.filter((s) => s.status === "active");
  const connected = active.filter((s) => s.medicalHistory.hfiles.lastSyncedAt);
  return { total: active.length, connected: connected.length };
}
