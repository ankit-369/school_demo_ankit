"use client";

import { useMemo } from "react";
import { ROLE_STAFF_IDS } from "@/lib/data/personas";
import { useAppStore } from "@/lib/store/app-store";
import { classKey, DIVISIONS, GRADES, type ClassKey } from "@/lib/types/grade";

const order = (k: ClassKey) => {
  const [g, d] = k.split("-");
  return GRADES.indexOf(g as (typeof GRADES)[number]) * 10 + DIVISIONS.indexOf(d as (typeof DIVISIONS)[number]);
};

/**
 * The teacher persona and only the students in their assigned classes.
 * Everything in /teacher goes through this, so a teacher never sees anyone else.
 */
export function useMyClass() {
  const teacher = useAppStore((s) => s.staff.find((st) => st.id === ROLE_STAFF_IDS.teacher));
  const allStudents = useAppStore((s) => s.students);
  return useMemo(() => {
    const classes = [...(teacher?.assignedClasses ?? [])].sort((a, b) => order(a) - order(b));
    const students = allStudents
      .filter((s) => s.status === "active" && classes.includes(classKey(s.grade, s.division)))
      .sort((a, b) => order(classKey(a.grade, a.division)) - order(classKey(b.grade, b.division)) || a.rollNumber - b.rollNumber);
    return { teacher, classes, students };
  }, [teacher, allStudents]);
}
