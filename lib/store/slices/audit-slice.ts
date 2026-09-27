import type { AuditLogEntry } from "@/lib/types/audit-log";
import { actorName, newId, nowIso } from "../helpers";
import type { SliceCreator } from "../state";

export type AuditSlice = {
  /** Newest first. */
  auditLog: AuditLogEntry[];
  logAudit: (action: string, target: string, reason?: string) => void;
};

export const createAuditSlice: SliceCreator<AuditSlice> = (set, get) => ({
  auditLog: [],
  logAudit: (action, target, reason = "") =>
    set((s) => ({
      auditLog: [
        { id: newId("aud"), actor: actorName(get()), action, target, reason, timestamp: nowIso() },
        ...s.auditLog,
      ],
    })),
});
