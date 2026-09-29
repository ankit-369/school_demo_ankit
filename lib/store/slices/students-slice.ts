import { computeBmi } from "@/lib/data/seed/student-factory";
import type { SchoolMedicalHistory } from "@/lib/types/medical-history";
import type { Student, StudentStatus } from "@/lib/types/student";
import type { SliceCreator } from "../state";
import { buildStudent, classTeacher, type NewStudentInput } from "../student-builder";

export type { NewStudentInput } from "../student-builder";

export type StudentPatch = Partial<Omit<Student, "id" | "hfid" | "bmi" | "medicalHistory">>;

export type StudentsSlice = {
  students: Student[];
  addStudent: (input: NewStudentInput) => string;
  /** Bulk add (CSV import); one audit entry for the batch. Returns the new ids. */
  importStudents: (inputs: NewStudentInput[], source: string) => string[];
  updateStudent: (id: string, patch: StudentPatch, reason?: string) => void;
  updateSchoolMedicalHistory: (id: string, patch: Partial<SchoolMedicalHistory>, reason?: string) => void;
  setStudentStatus: (id: string, status: StudentStatus, reason: string) => void;
};

export const createStudentsSlice: SliceCreator<StudentsSlice> = (set, get) => {
  const replace = (id: string, fn: (s: Student) => Student) =>
    set((state) => ({ students: state.students.map((s) => (s.id === id ? fn(s) : s)) }));
  const nameOf = (id: string) => get().students.find((s) => s.id === id)?.name ?? id;

  return {
    students: [],

    addStudent: (input) => {
      const student = buildStudent(input, get().students.length + 1, get().staff);
      set((s) => ({ students: [...s.students, student] }));
      get().logAudit("student.created", student.name);
      return student.id;
    },

    importStudents: (inputs, source) => {
      const start = get().students.length;
      const created = inputs.map((input, i) => buildStudent(input, start + i + 1, get().staff));
      set((s) => ({ students: [...s.students, ...created] }));
      get().logAudit("students.imported", `${created.length} students`, source);
      return created.map((c) => c.id);
    },

    updateStudent: (id, patch, reason = "") => {
      replace(id, (s) => {
        const next = { ...s, ...patch };
        next.bmi = computeBmi(next.heightCm, next.weightKg);
        // Only re-derive the class teacher when the caller didn't explicitly set one themselves.
        if ((patch.grade || patch.division) && !patch.classTeacherId) {
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

    setStudentStatus: (id, status, reason) => {
      replace(id, (s) => ({ ...s, status }));
      get().logAudit(`student.${status}`, nameOf(id), reason);
    },
  };
};
