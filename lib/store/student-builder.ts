import { computeBmi, teacherFor } from "@/lib/data/seed/student-factory";
import { classKey, type Division, type Grade } from "@/lib/types/grade";
import type { SchoolMedicalHistory } from "@/lib/types/medical-history";
import type { Staff } from "@/lib/types/staff";
import type { Student } from "@/lib/types/student";
import { newId } from "./helpers";

export type NewStudentInput = Omit<
  Student,
  "id" | "hfid" | "bmi" | "admissionNo" | "status" | "classTeacherId" | "photoUrl" | "medicalHistory" | "history"
> & {
  photoUrl?: string | null;
  school?: Partial<SchoolMedicalHistory>;
};

/** The teacher assigned to a class, falling back to the grade band's teacher. */
export function classTeacher(staff: Staff[], grade: Grade, division: Division) {
  const key = classKey(grade, division);
  return staff.find((s) => s.role === "teacher" && s.assignedClasses.includes(key))?.id ?? teacherFor(grade);
}

/** A new active student; `seq` numbers the HFID and admission number. */
export function buildStudent({ school, photoUrl = null, ...input }: NewStudentInput, seq: number, staff: Staff[]): Student {
  return {
    ...input,
    id: newId("stu"),
    photoUrl,
    hfid: `SMA-2026-${String(seq).padStart(4, "0")}`,
    admissionNo: `SAS-${2000 + seq}`,
    bmi: computeBmi(input.heightCm, input.weightKg),
    classTeacherId: classTeacher(staff, input.grade, input.division),
    status: "active",
    medicalHistory: {
      school: { allergies: [], conditions: [], surgeries: [], notes: "", ...school },
      hfiles: { allergies: [], immunizations: [], labReports: [], lastSyncedAt: null },
    },
  };
}
