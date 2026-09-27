import { z } from "zod";
import { localDateString } from "@/lib/format";
import { DIVISIONS, GRADES } from "@/lib/types/grade";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const num = (label: string, min: number, max: number) =>
  z
    .number({ error: `Enter ${label}` })
    .min(min, `${capital(label)} looks too low`)
    .max(max, `${capital(label)} looks too high`);

function capital(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const addStudentSchema = z.object({
  name: z.string().trim().min(2, "Enter the student's full name"),
  gender: z.enum(["male", "female"], { error: "Select a gender" }),
  dob: z
    .string()
    .min(1, "Enter a date of birth")
    .refine((v) => v <= localDateString(), "Date of birth can't be in the future"),
  grade: z.enum(GRADES, { error: "Select a class" }),
  division: z.enum(DIVISIONS, { error: "Select a division" }),
  rollNumber: num("a roll number", 1, 99).int("Roll number must be a whole number"),
  bloodGroup: z.enum(BLOOD_GROUPS, { error: "Select a blood group" }),
  heightCm: num("height", 60, 220),
  weightKg: num("weight", 8, 150),
  vision: z.string().trim().regex(/^\d+\/\d+$/, "Use Snellen notation, e.g. 6/6"),
  hearing: z.enum(["normal", "mild-loss", "needs-review"]),
  house: z.enum(["Ganga", "Yamuna", "Kaveri", "Narmada"], { error: "Select a house" }),
  transport: z.enum(["school-bus", "private", "walker"]),
  guardianName: z.string().trim().min(2, "Enter the guardian's name"),
  guardianRelation: z.enum(["Mother", "Father", "Guardian"]),
  guardianPhone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{10,16}$/, "Enter a valid phone number, e.g. +91 98200 12345"),
  allergies: z.string(),
  conditions: z.string(),
  notes: z.string(),
});

export type AddStudentValues = z.infer<typeof addStudentSchema>;

export const ADD_STUDENT_DEFAULTS: Partial<AddStudentValues> = {
  division: "A",
  vision: "6/6",
  hearing: "normal",
  transport: "school-bus",
  guardianRelation: "Mother",
  allergies: "",
  conditions: "",
  notes: "",
};

/** "Peanuts, pollen , " → ["Peanuts", "Pollen"] */
export function splitList(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1));
}

export { BLOOD_GROUPS };
