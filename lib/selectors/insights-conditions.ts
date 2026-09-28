import type { Grade } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";

export type ConditionKind = "allergy" | "condition";

export type ConditionGroup = {
  label: string;
  kind: ConditionKind;
  /** On the school record. */
  students: Student[];
  /** Reported on hfiles.in but not (yet) on the school record — shown separately, never merged. */
  hfilesOnly: Student[];
};

function group(students: Student[], kind: ConditionKind): ConditionGroup[] {
  const map = new Map<string, ConditionGroup>();
  const get = (label: string) => {
    if (!map.has(label)) map.set(label, { label, kind, students: [], hfilesOnly: [] });
    return map.get(label)!;
  };
  for (const s of students) {
    const school = kind === "allergy" ? s.medicalHistory.school.allergies : s.medicalHistory.school.conditions;
    school.forEach((label) => get(label).students.push(s));
    if (kind === "allergy") {
      s.medicalHistory.hfiles.allergies
        .filter((a) => !school.includes(a))
        .forEach((label) => get(label).hfilesOnly.push(s));
    }
  }
  return [...map.values()].sort(
    (a, b) => b.students.length - a.students.length || b.hfilesOnly.length - a.hfilesOnly.length || a.label.localeCompare(b.label),
  );
}

/** Active students grouped by allergy and by condition, largest groups first. */
export function conditionGroups(students: Student[], grade: Grade | null) {
  const scope = students.filter((s) => s.status === "active" && (!grade || s.grade === grade));
  return { allergies: group(scope, "allergy"), conditions: group(scope, "condition"), total: scope.length };
}

/** Students on the school record with at least one allergy or condition. */
export function flaggedCount(students: Student[], grade: Grade | null) {
  return students.filter(
    (s) =>
      s.status === "active" &&
      (!grade || s.grade === grade) &&
      s.medicalHistory.school.allergies.length + s.medicalHistory.school.conditions.length > 0,
  ).length;
}
