import type { Division, Grade } from "./grade";
import type { MedicalHistory } from "./medical-history";

export type Gender = "male" | "female";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type HearingStatus = "normal" | "mild-loss" | "needs-review";

export type House = "Ganga" | "Yamuna" | "Kaveri" | "Narmada";

export type Transport = "school-bus" | "private" | "walker";

export type StudentStatus = "active" | "graduated" | "transferred" | "exited";

export type YearOutcome = "promoted" | "retained" | "graduated" | "transferred" | "exited";

/** One closed academic year on a student's record. */
export type YearRecord = {
  year: string;
  grade: Grade;
  division: Division;
  outcome: YearOutcome;
  closedAt: string;
};

export type Guardian = {
  name: string;
  relation: "Mother" | "Father" | "Guardian";
  phone: string;
};

/** Who to call in an emergency if the primary guardian can't be reached — often the same person. */
export type EmergencyContact = {
  name: string;
  relation: string;
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
  /** Snellen notation, e.g. "6/6"; "L 6/6 · R 6/9" when the eyes differ. */
  vision: string;
  hearing: HearingStatus;
  admissionNo: string;
  house: House;
  transport: Transport;
  guardian: Guardian;
  emergencyContact: EmergencyContact;
  /** Set only when known — many records only have the guardian's side on file. */
  motherName?: string;
  fatherName?: string;
  status: StudentStatus;
  /** Previous academic years, oldest first. */
  history?: YearRecord[];
  medicalHistory: MedicalHistory;
};
