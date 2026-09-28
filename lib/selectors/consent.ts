import { GRADES, gradeLabel } from "@/lib/types/grade";
import type { Camp } from "@/lib/types/camp";
import type { ConsentRecord } from "@/lib/types/consent";
import type { Student } from "@/lib/types/student";

export type ConsentRow = { record: ConsentRecord; student: Student };

export type ConsentForm = {
  /** formName + campId, since two camps could reuse a form name. */
  key: string;
  formName: string;
  camp?: Camp;
  rows: ConsentRow[];
  signed: number;
  pending: number;
};

/** "Whole school" if every grade is represented, otherwise the actual grade range covered. */
export function scopeLabel(form: Pick<ConsentForm, "rows">) {
  const present = new Set(form.rows.map((r) => r.student.grade));
  if (present.size === GRADES.length) return "Whole school";
  const covered = GRADES.filter((g) => present.has(g));
  const first = covered[0];
  const last = covered[covered.length - 1];
  return first === last ? gradeLabel(first) : `${gradeLabel(first)} – ${gradeLabel(last)}`;
}

/** Every consent form, grouped, with completion counts — largest group first. */
export function consentForms(consents: ConsentRecord[], students: Student[], camps: Camp[]): ConsentForm[] {
  const byId = new Map(students.map((s) => [s.id, s]));
  const groups = new Map<string, ConsentForm>();

  for (const record of consents) {
    const student = byId.get(record.studentId);
    if (!student) continue;
    const key = `${record.formName}__${record.campId ?? ""}`;
    if (!groups.has(key)) {
      groups.set(key, { key, formName: record.formName, camp: camps.find((c) => c.id === record.campId), rows: [], signed: 0, pending: 0 });
    }
    const form = groups.get(key)!;
    form.rows.push({ record, student });
    form[record.status === "signed" ? "signed" : "pending"]++;
  }

  for (const form of groups.values()) {
    form.rows.sort((a, b) => a.student.name.localeCompare(b.student.name));
  }
  return [...groups.values()].sort((a, b) => b.rows.length - a.rows.length);
}

export function completionPct(form: Pick<ConsentForm, "signed" | "pending">) {
  const total = form.signed + form.pending;
  return total === 0 ? 100 : Math.round((form.signed / total) * 100);
}
