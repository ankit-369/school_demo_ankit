import { z } from "zod";
import { formatPhone } from "@/lib/config";
import { localDateString } from "@/lib/format";
import { DIVISIONS, GRADES } from "@/lib/types/grade";

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const HOUSES = ["Ganga", "Yamuna", "Kaveri", "Narmada"] as const;
export const TRANSPORTS = ["school-bus", "private", "walker"] as const;
export const HEARING_STATUSES = ["normal", "mild-loss", "needs-review"] as const;
export const GUARDIAN_RELATIONS = ["Mother", "Father", "Guardian"] as const;

function capital(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const num = (label: string, min: number, max: number) =>
  z
    .number({ error: `Enter ${label}` })
    .min(min, `${capital(label)} looks too low`)
    .max(max, `${capital(label)} looks too high`);

const phone = z
  .string()
  .trim()
  .regex(/^\+?[\d\s-]{10,16}$/, "Enter a valid phone number, e.g. +91 00000 00000");

const snellen = z.string().trim().regex(/^\d+\/\d+$/, "Use Snellen notation, e.g. 6/6");

/**
 * One field validator per Student attribute, reused by the Add Student form
 * (the full object below), every profile EditableSection (a `.pick()` of
 * these), and CSV row validation (each cell checked against its own field
 * after the importer's loose text parsing).
 */
export const studentFields = {
  name: z.string().trim().min(2, "Enter the student's full name"),
  photoUrl: z.string().nullable(),
  dob: z
    .string()
    .min(1, "Enter a date of birth")
    .refine((v) => v <= localDateString(), "Date of birth can't be in the future"),
  gender: z.enum(["male", "female"], { error: "Select a gender" }),
  grade: z.enum(GRADES, { error: "Select a class" }),
  division: z.enum(DIVISIONS, { error: "Select a division" }),
  rollNumber: num("a roll number", 1, 99).int("Roll number must be a whole number"),
  classTeacherId: z.string(),
  bloodGroup: z.enum(BLOOD_GROUPS, { error: "Select a blood group" }),
  heightCm: num("height", 60, 220),
  weightKg: num("weight", 8, 150),
  visionLeft: snellen,
  visionRight: snellen,
  vision: z.string().trim().min(1),
  hearing: z.enum(HEARING_STATUSES),
  admissionNo: z.string().trim().min(1, "Enter an admission number"),
  house: z.enum(HOUSES, { error: "Select a house" }),
  transport: z.enum(TRANSPORTS),
  allergies: z.string(),
  conditions: z.string(),
  notes: z.string(),
  guardianName: z.string().trim().min(2, "Enter the guardian's name"),
  guardianRelation: z.enum(GUARDIAN_RELATIONS),
  guardianPhone: phone,
  /** Only actually required when `sameAsGuardian` is false — see addStudentSchema's superRefine. */
  emergencyContactName: z.string().trim(),
  emergencyContactRelation: z.string().trim(),
  emergencyContactPhone: z.string().trim(),
  sameAsGuardian: z.boolean(),
  motherName: z.string().trim(),
  fatherName: z.string().trim(),
};

export const addStudentSchema = z
  .object({
    name: studentFields.name,
    dob: studentFields.dob,
    gender: studentFields.gender,
    grade: studentFields.grade,
    division: studentFields.division,
    rollNumber: studentFields.rollNumber,
    bloodGroup: studentFields.bloodGroup,
    heightCm: studentFields.heightCm,
    weightKg: studentFields.weightKg,
    visionLeft: studentFields.visionLeft,
    visionRight: studentFields.visionRight,
    hearing: studentFields.hearing,
    house: studentFields.house,
    transport: studentFields.transport,
    allergies: studentFields.allergies,
    conditions: studentFields.conditions,
    notes: studentFields.notes,
    guardianName: studentFields.guardianName,
    guardianRelation: studentFields.guardianRelation,
    guardianPhone: studentFields.guardianPhone,
    sameAsGuardian: studentFields.sameAsGuardian,
    emergencyContactName: studentFields.emergencyContactName,
    emergencyContactRelation: studentFields.emergencyContactRelation,
    emergencyContactPhone: studentFields.emergencyContactPhone,
    motherName: studentFields.motherName,
    fatherName: studentFields.fatherName,
  })
  .superRefine((v, ctx) => {
    if (!v.sameAsGuardian) {
      if (v.emergencyContactName.trim().length < 2) ctx.addIssue({ code: "custom", path: ["emergencyContactName"], message: "Enter a contact name" });
      if (v.emergencyContactRelation.trim().length < 1) ctx.addIssue({ code: "custom", path: ["emergencyContactRelation"], message: "Say how they're related" });
      if (!/^\+?[\d\s-]{10,16}$/.test(v.emergencyContactPhone.trim())) {
        ctx.addIssue({ code: "custom", path: ["emergencyContactPhone"], message: "Enter a valid phone number, e.g. +91 00000 00000" });
      }
    }
  });

export type AddStudentValues = z.infer<typeof addStudentSchema>;

export const ADD_STUDENT_DEFAULTS: Partial<AddStudentValues> = {
  division: "A",
  visionLeft: "6/6",
  visionRight: "6/6",
  hearing: "normal",
  house: "Ganga",
  transport: "school-bus",
  guardianRelation: "Mother",
  guardianPhone: formatPhone(),
  sameAsGuardian: true,
  emergencyContactName: "",
  emergencyContactRelation: "Guardian",
  emergencyContactPhone: formatPhone(),
  allergies: "",
  conditions: "",
  notes: "",
  motherName: "",
  fatherName: "",
};

/** "Peanuts, pollen , " → ["Peanuts", "Pollen"] */
export function splitList(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1));
}

/** "6/6", "6/6" → "6/6"; "6/6", "6/9" → "L 6/6 · R 6/9" */
export function combineVision(left: string, right: string) {
  return left === right ? left : `L ${left} · R ${right}`;
}

/** Inverse of combineVision — used to seed the two edit fields from the stored value. */
export function splitVision(vision: string): { left: string; right: string } {
  const m = vision.match(/^L (\S+) · R (\S+)$/);
  return m ? { left: m[1], right: m[2] } : { left: vision, right: vision };
}
