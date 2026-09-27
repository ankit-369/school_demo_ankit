import { computeBmi, teacherFor } from "@/lib/data/seed/student-factory";
import { GRADES, classKey, type Division, type Grade } from "@/lib/types/grade";
import type { SchoolMedicalHistory, Surgery } from "@/lib/types/medical-history";
import type { Staff } from "@/lib/types/staff";
import type { Student, StudentStatus } from "@/lib/types/student";
import { newId } from "../helpers";
import type { SliceCreator } from "../state";

export type NewStudentInput = Omit<
  Student,
  "id" | "hfid" | "bmi" | "admissionNo" | "status" | "classTeacherId" | "photoUrl" | "medicalHistory"
> & {
  photoUrl?: string | null;
  school?: Partial<SchoolMedicalHistory>;
};

export type StudentPatch = Partial<Omit<Student, "id" | "hfid" | "bmi" | "medicalHistory">>;

export type PromoteInput = {
  studentIds: string[];
  /** Omit to move each student up one grade; Grade 12 students graduate. */
  toGrade?: Grade;
  toDivision?: Division;
  reason: string;
};

export type StudentsSlice = {
  students: Student[];
  addStudent: (input: NewStudentInput) => string;
  updateStudent: (id: string, patch: StudentPatch, reason?: string) => void;
  updateSchoolMedicalHistory: (id: string, patch: Partial<SchoolMedicalHistory>, reason?: string) => void;
  addSurgery: (id: string, surgery: Omit<Surgery, "id">) => void;
  promoteStudents: (input: PromoteInput) => { promoted: number; graduated: number };
  setStudentStatus: (id: string, status: StudentStatus, reason: string) => void;
};

function classTeacher(staff: Staff[], grade: Grade, division: Division) {
  const key = classKey(grade, division);
  return staff.find((s) => s.role === "teacher" && s.assignedClasses.includes(key))?.id ?? teacherFor(grade);
}

export const createStudentsSlice: SliceCreator<StudentsSlice> = (set, get) => {
  const replace = (id: string, fn: (s: Student) => Student) =>
    set((state) => ({ students: state.students.map((s) => (s.id === id ? fn(s) : s)) }));
  const nameOf = (id: string) => get().students.find((s) => s.id === id)?.name ?? id;

  return {
    students: [],

    addStudent: ({ school, photoUrl = null, ...input }) => {
      const id = newId("stu");
      const n = get().students.length + 1;
      const student: Student = {
        ...input,
        id,
        photoUrl,
        hfid: `SMA-2026-${String(n).padStart(4, "0")}`,
        admissionNo: `SAS-${2000 + n}`,
        bmi: computeBmi(input.heightCm, input.weightKg),
        classTeacherId: classTeacher(get().staff, input.grade, input.division),
        status: "active",
        medicalHistory: {
          school: { allergies: [], conditions: [], surgeries: [], notes: "", ...school },
          hfiles: { allergies: [], immunizations: [], labReports: [], lastSyncedAt: null },
        },
      };
      set((s) => ({ students: [...s.students, student] }));
      get().logAudit("student.created", student.name);
      return id;
    },

    updateStudent: (id, patch, reason = "") => {
      replace(id, (s) => {
        const next = { ...s, ...patch };
        next.bmi = computeBmi(next.heightCm, next.weightKg);
        if (patch.grade || patch.division) {
          next.classTeacherId = classTeacher(get().staff, next.grade, next.division);
        }
        return next;
      });
      get().logAudit("student.updated", nameOf(id), reason);
    },

    updateSchoolMedicalHistory: (id, patch, reason = "") => {
      replace(id, (s) => ({
        ...s,
        medicalHistory: { ...s.medicalHistory, school: { ...s.medicalHistory.school, ...patch } },
      }));
      get().logAudit("medical-history.updated", nameOf(id), reason);
    },

    addSurgery: (id, surgery) => {
      replace(id, (s) => ({
        ...s,
        medicalHistory: {
          ...s.medicalHistory,
          school: { ...s.medicalHistory.school, surgeries: [{ ...surgery, id: newId("surg") }, ...s.medicalHistory.school.surgeries] },
        },
      }));
      get().logAudit("medical-history.surgery-added", nameOf(id), surgery.name);
    },

    promoteStudents: ({ studentIds, toGrade, toDivision, reason }) => {
      const ids = new Set(studentIds);
      const staff = get().staff;
      let promoted = 0;
      let graduated = 0;
      set((state) => ({
        students: state.students.map((s) => {
          if (!ids.has(s.id) || s.status !== "active") return s;
          const nextGrade = toGrade ?? GRADES[GRADES.indexOf(s.grade) + 1];
          if (!nextGrade) {
            graduated++;
            return { ...s, status: "graduated" };
          }
          promoted++;
          const division = toDivision ?? s.division;
          return { ...s, grade: nextGrade, division, classTeacherId: classTeacher(staff, nextGrade, division) };
        }),
      }));
      get().logAudit("students.promoted", `${promoted} promoted, ${graduated} graduated`, reason);
      return { promoted, graduated };
    },

    setStudentStatus: (id, status, reason) => {
      replace(id, (s) => ({ ...s, status }));
      get().logAudit(`student.${status}`, nameOf(id), reason);
    },
  };
};
