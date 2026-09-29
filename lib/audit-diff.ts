/** Shared "before → after" summarising for auto-generated audit-log entries. */

export type DiffField<T> = { name: keyof T; label: string; format?: (v: unknown) => string };

const show = (v: unknown, fmt?: (v: unknown) => string) =>
  v === undefined || v === null || v === "" ? "—" : fmt ? fmt(v) : String(v);

/** "Blood group: O+ → B+; Weight: 30kg → 32kg" — only the fields that actually changed. */
export function summarizeChanges<T extends Record<string, unknown>>(fields: DiffField<T>[], before: T, after: T): string {
  return fields
    .filter((f) => String(before[f.name] ?? "") !== String(after[f.name] ?? ""))
    .map((f) => `${f.label}: ${show(before[f.name], f.format)} → ${show(after[f.name], f.format)}`)
    .join("; ");
}

/** "Allergies added: Shellfish; Allergies removed: Dust mites" */
export function summarizeListChange(label: string, before: string[], after: string[]): string {
  const added = after.filter((a) => !before.includes(a));
  const removed = before.filter((b) => !after.includes(b));
  return [added.length ? `${label} added: ${added.join(", ")}` : "", removed.length ? `${label} removed: ${removed.join(", ")}` : ""]
    .filter(Boolean)
    .join("; ");
}
