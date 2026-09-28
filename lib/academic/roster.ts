import { classKey, DIVISIONS, GRADES, type ClassKey, type Division, type Grade } from "@/lib/types/grade";
import type { Staff } from "@/lib/types/staff";
import type { Student } from "@/lib/types/student";

export type ClassRoster = {
  key: ClassKey;
  grade: Grade;
  division: Division;
  students: Student[];
  teacherName: string;
};

/** Active students grouped by class, in school order (JKG-A … 12-C), each sorted by roll number. */
export function rosterByClass(students: Student[], staff: Staff[]): ClassRoster[] {
  const map = new Map<ClassKey, Student[]>();
  students
    .filter((s) => s.status === "active")
    .forEach((s) => {
      const k = classKey(s.grade, s.division);
      map.set(k, [...(map.get(k) ?? []), s]);
    });

  return [...map.entries()]
    .map(([key, list]) => {
      const { grade, division } = list[0];
      const teacher = staff.find((t) => t.id === list[0].classTeacherId);
      return { key, grade, division, students: [...list].sort((a, b) => a.rollNumber - b.rollNumber), teacherName: teacher?.name ?? "Unassigned" };
    })
    .sort((a, b) => GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade) || DIVISIONS.indexOf(a.division) - DIVISIONS.indexOf(b.division));
}
