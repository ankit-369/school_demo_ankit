import { formatPhone } from "@/lib/config";
import { GRADES, type Division, type Grade } from "@/lib/types/grade";
import type {
  HfilesMedicalHistory,
  Immunization,
  LabReport,
  Surgery,
} from "@/lib/types/medical-history";
import type { BloodGroup, Gender, Guardian, HearingStatus, House, Student, Transport } from "@/lib/types/student";
import { STAFF_IDS } from "./staff";

type WithoutId<T> = Omit<T, "id">;

/** Compact authoring shape for a seed student; the factory derives the rest. */
export type StudentSeed = {
  seq: number;
  name: string;
  gender: Gender;
  dob: string;
  grade: Grade;
  division: Division;
  roll: number;
  blood: BloodGroup;
  heightCm: number;
  weightKg: number;
  guardian: [name: string, relation: Guardian["relation"]];
  vision?: string;
  hearing?: HearingStatus;
  allergies?: string[];
  conditions?: string[];
  surgeries?: WithoutId<Surgery>[];
  notes?: string;
  hfiles?: {
    lastSyncedAt: string;
    allergies?: string[];
    immunizations?: WithoutId<Immunization>[];
    labReports?: WithoutId<LabReport>[];
  };
};

const HOUSES: House[] = ["Ganga", "Yamuna", "Kaveri", "Narmada"];
const TRANSPORT: Transport[] = ["school-bus", "private", "walker"];

export function studentId(seq: number) {
  return `stu-${String(seq).padStart(2, "0")}`;
}

export function teacherFor(grade: Grade): string {
  const i = GRADES.indexOf(grade);
  if (i <= GRADES.indexOf("3")) return STAFF_IDS.primaryTeacher;
  if (i <= GRADES.indexOf("7")) return STAFF_IDS.middleTeacher;
  return STAFF_IDS.seniorTeacher;
}

export function computeBmi(heightCm: number, weightKg: number) {
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

function withIds<T>(prefix: string, items: T[] = []) {
  return items.map((item, i) => ({ ...item, id: `${prefix}-${i + 1}` }));
}

export function makeStudent(s: StudentSeed): Student {
  const id = studentId(s.seq);
  const hfiles: HfilesMedicalHistory = s.hfiles
    ? {
        allergies: s.hfiles.allergies ?? [],
        immunizations: withIds(`${id}-imm`, s.hfiles.immunizations),
        labReports: withIds(`${id}-lab`, s.hfiles.labReports),
        lastSyncedAt: s.hfiles.lastSyncedAt,
      }
    : { allergies: [], immunizations: [], labReports: [], lastSyncedAt: null };

  return {
    id,
    hfid: `SMA-2024-${String(396 + s.seq).padStart(4, "0")}`,
    name: s.name,
    photoUrl: null,
    dob: s.dob,
    gender: s.gender,
    grade: s.grade,
    division: s.division,
    rollNumber: s.roll,
    classTeacherId: teacherFor(s.grade),
    bloodGroup: s.blood,
    heightCm: s.heightCm,
    weightKg: s.weightKg,
    bmi: computeBmi(s.heightCm, s.weightKg),
    vision: s.vision ?? "6/6",
    hearing: s.hearing ?? "normal",
    admissionNo: `SAS-${1000 + s.seq}`,
    house: HOUSES[s.seq % HOUSES.length],
    transport: TRANSPORT[s.seq % TRANSPORT.length],
    guardian: {
      name: s.guardian[0],
      relation: s.guardian[1],
      phone: formatPhone(),
    },
    status: "active",
    medicalHistory: {
      school: {
        allergies: s.allergies ?? [],
        conditions: s.conditions ?? [],
        surgeries: withIds(`${id}-surg`, s.surgeries),
        notes: s.notes ?? "",
      },
      hfiles,
    },
  };
}
