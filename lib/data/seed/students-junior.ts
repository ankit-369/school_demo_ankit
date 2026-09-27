import type { StudentSeed } from "./student-factory";

/** JKG – Grade 5. */
export const juniorStudentSeeds: StudentSeed[] = [
  {
    seq: 1, name: "Aarav Sharma", gender: "male", dob: "2022-03-14", grade: "JKG", division: "A", roll: 1,
    blood: "B+", heightCm: 101, weightKg: 16, guardian: ["Neha Sharma", "Mother"],
    hfiles: {
      lastSyncedAt: "2026-09-20T09:12:00Z",
      immunizations: [
        { vaccine: "MMR", dose: "Dose 2", date: "2023-09-10", provider: "Rainbow Children's Hospital" },
        { vaccine: "Typhoid conjugate", dose: "Dose 1", date: "2024-04-02", provider: "Rainbow Children's Hospital" },
      ],
    },
  },
  {
    seq: 2, name: "Anaya Iyer", gender: "female", dob: "2022-07-02", grade: "JKG", division: "A", roll: 2,
    blood: "O+", heightCm: 99, weightKg: 15, guardian: ["Suresh Iyer", "Father"],
    allergies: ["Peanuts"], notes: "Carries an EpiPen in her school bag. Nut-free table at lunch.",
    hfiles: {
      lastSyncedAt: "2026-09-18T14:40:00Z",
      allergies: ["Peanuts", "Tree nuts"],
      immunizations: [{ vaccine: "MMR", dose: "Dose 2", date: "2023-12-01", provider: "Apollo Clinic" }],
      labReports: [{ name: "Food allergy panel (IgE)", date: "2025-11-12", lab: "SRL Diagnostics", summary: "Peanut and cashew IgE elevated." }],
    },
  },
  {
    seq: 3, name: "Vihaan Mehta", gender: "male", dob: "2021-05-21", grade: "SKG", division: "A", roll: 1,
    blood: "A+", heightCm: 108, weightKg: 18, guardian: ["Pooja Mehta", "Mother"],
    allergies: ["Dust mites"],
  },
  {
    seq: 4, name: "Diya Patel", gender: "female", dob: "2021-09-30", grade: "SKG", division: "A", roll: 2,
    blood: "B+", heightCm: 106, weightKg: 17, guardian: ["Rakesh Patel", "Father"],
    hearing: "mild-loss", conditions: ["Eczema"], notes: "Seat near the front of class; mild hearing loss on left side.",
  },
  {
    seq: 5, name: "Kabir Singh", gender: "male", dob: "2020-01-17", grade: "1", division: "A", roll: 5,
    blood: "O+", heightCm: 117, weightKg: 21, guardian: ["Harpreet Singh", "Father"],
    allergies: ["Pollen"], conditions: ["Asthma"], notes: "Salbutamol inhaler kept in the health centre.",
    hfiles: {
      lastSyncedAt: "2026-09-25T08:05:00Z",
      allergies: ["Pollen"],
      immunizations: [{ vaccine: "Influenza", dose: "Annual 2026", date: "2026-04-15", provider: "Fortis Hospital" }],
      labReports: [{ name: "Spirometry", date: "2026-02-08", lab: "Fortis Hospital", summary: "Mild reversible airway obstruction." }],
    },
  },
  {
    seq: 6, name: "Ishita Reddy", gender: "female", dob: "2019-06-11", grade: "2", division: "B", roll: 9,
    blood: "A-", heightCm: 122, weightKg: 23, guardian: ["Lakshmi Reddy", "Mother"],
  },
  {
    seq: 7, name: "Arjun Nair", gender: "male", dob: "2018-04-03", grade: "3", division: "A", roll: 3,
    blood: "B-", heightCm: 129, weightKg: 27, guardian: ["Anil Nair", "Father"],
    conditions: ["Asthma"], notes: "Exercise-induced; uses inhaler before PE.",
    hfiles: {
      lastSyncedAt: "2026-08-30T11:20:00Z",
      immunizations: [{ vaccine: "Tdap", dose: "Booster", date: "2025-06-19", provider: "KIMS Hospital" }],
    },
  },
  {
    seq: 8, name: "Myra Kapoor", gender: "female", dob: "2018-11-25", grade: "3", division: "A", roll: 12,
    blood: "AB+", heightCm: 127, weightKg: 25, guardian: ["Sonal Kapoor", "Mother"],
    conditions: ["Eczema"],
  },
  {
    seq: 9, name: "Reyansh Gupta", gender: "male", dob: "2017-08-09", grade: "4", division: "A", roll: 7,
    blood: "O-", heightCm: 134, weightKg: 29, guardian: ["Manish Gupta", "Father"],
    conditions: ["Type 1 diabetes"], notes: "Insulin pump. Glucose tablets in health centre; snack allowed in class.",
    hfiles: {
      lastSyncedAt: "2026-09-26T16:45:00Z",
      immunizations: [{ vaccine: "Influenza", dose: "Annual 2026", date: "2026-04-02", provider: "Max Healthcare" }],
      labReports: [
        { name: "HbA1c", date: "2026-06-14", lab: "Thyrocare", summary: "HbA1c 7.4% — within paediatric target." },
      ],
    },
  },
  {
    seq: 10, name: "Saanvi Joshi", gender: "female", dob: "2016-02-27", grade: "5", division: "B", roll: 18,
    blood: "A+", heightCm: 139, weightKg: 32, guardian: ["Meenal Joshi", "Mother"],
    allergies: ["Penicillin"],
    hfiles: {
      lastSyncedAt: "2026-07-22T10:00:00Z",
      allergies: ["Penicillin", "Sulfa drugs"],
      immunizations: [{ vaccine: "HPV", dose: "Dose 1", date: "2026-03-11", provider: "Cloudnine Clinic" }],
    },
  },
  {
    seq: 11, name: "Ethan Caldwell", gender: "male", dob: "2016-10-05", grade: "5", division: "B", roll: 12,
    blood: "B+", heightCm: 141, weightKg: 35, guardian: ["Grace Caldwell", "Mother"],
    vision: "6/12", conditions: ["ADHD"], notes: "Extra time in exams. Follow up on vision screening.",
  },
];
