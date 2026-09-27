export type AuditLogEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  reason: string;
  timestamp: string;
};
