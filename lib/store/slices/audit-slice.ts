import type { AuditLogEntry } from "@/lib/types/audit-log";
import { actorName, newId, nowIso } from "../helpers";
import type { SliceCreator } from "../state";

export type AuditSlice = {
  /** Newest first. */
  auditLog: AuditLogEntry[];
  /** Actor defaults to the current "Viewing as" persona; pass one for link-based access (e.g. an external doctor). */
  logAudit: (action: string, target: string, reason?: string, actor?: string) => void;
};

export const createAuditSlice: SliceCreator<AuditSlice> = (set, get) => ({
  auditLog: [],
  logAudit: (action, target, reason = "", actor) =>
    set((s) => ({
      auditLog: [
        { id: newId("aud"), actor: actor ?? actorName(get()), action, target, reason, timestamp: nowIso() },
        ...s.auditLog,
      ],
    })),
});
