import type { AuditLogEntry } from "@/lib/types/audit-log";

export type AuditCategory = "Students" | "Staff & permissions" | "Health camps" | "Medical records" | "Consent" | "hfiles.in" | "Settings" | "Other";

const CATEGORY_BY_PREFIX: [string, AuditCategory][] = [
  ["student.", "Students"],
  ["students.", "Students"],
  ["academic-year.", "Students"],
  ["staff.", "Staff & permissions"],
  ["permission.", "Staff & permissions"],
  ["camp.", "Health camps"],
  ["medical-history.", "Medical records"],
  ["clinical-note.", "Medical records"],
  ["report.", "Medical records"],
  ["consent.", "Consent"],
  ["hfiles.", "hfiles.in"],
  ["settings.", "Settings"],
];

export function categoryOf(action: string): AuditCategory {
  return CATEGORY_BY_PREFIX.find(([prefix]) => action.startsWith(prefix))?.[1] ?? "Other";
}

/** "student.created" -> "Student created". */
export function humanizeAction(action: string) {
  const text = action.replace(/[.-]/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export type AuditFilter = { query: string; category: AuditCategory | "" };
export const EMPTY_AUDIT_FILTER: AuditFilter = { query: "", category: "" };

export function filterAuditLog(entries: AuditLogEntry[], f: AuditFilter): AuditLogEntry[] {
  const q = f.query.trim().toLowerCase();
  return entries.filter((e) => {
    if (f.category && categoryOf(e.action) !== f.category) return false;
    if (q && ![e.actor, e.action, e.target, e.reason].some((v) => v.toLowerCase().includes(q))) return false;
    return true;
  });
}
