import type { Division, Grade } from "./grade";
import type { MedicalHistory } from "./medical-history";

export type Gender = "male" | "female";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type HearingStatus = "normal" | "mild-loss" | "needs-review";

export type House = "Ganga" | "Yamuna" | "Kaveri" | "Narmada";

export type Transport = "school-bus" | "private" | "walker";

export type StudentStatus = "active" | "graduated" | "transferred";

export type Guardian = {
  name: string;
  relation: "Mother" | "Father" | "Guardian";
  phone: string;
};

export type Student = {
  id: string;
  hfid: string;
  name: string;
  /** null → UI falls back to initials. */
  photoUrl: string | null;
  dob: string;
  gender: Gender;
  grade: Grade;
  division: Division;
  rollNumber: number;
  classTeacherId: string;
  bloodGroup: BloodGroup;
  heightCm: number;
  weightKg: number;
  bmi: number;
  /** Snellen notation, e.g. "6/6". */
  vision: string;
  hearing: HearingStatus;
  admissionNo: string;
  house: House;
  transport: Transport;
  guardian: Guardian;
  status: StudentStatus;
  medicalHistory: MedicalHistory;
};
