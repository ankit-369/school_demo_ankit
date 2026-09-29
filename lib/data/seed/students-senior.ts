import type { StudentSeed } from "./student-factory";

/** Grade 6 – Grade 12. */
export const seniorStudentSeeds: StudentSeed[] = [
  {
    seq: 12, name: "Maya Rodriguez", gender: "female", dob: "2015-03-19", grade: "6", division: "A", roll: 4,
    blood: "O+", heightCm: 146, weightKg: 38, guardian: ["Carlos Rodriguez", "Father"],
    allergies: ["Peanuts"], notes: "EpiPen in bag and in health centre.",
    hfiles: {
      lastSyncedAt: "2026-09-12T13:30:00Z",
      allergies: ["Peanuts"],
      immunizations: [{ vaccine: "HPV", dose: "Dose 1", date: "2026-01-20", provider: "Manipal Hospital" }],
    },
  },
  {
    seq: 13, name: "Leo Nakajima", gender: "male", dob: "2015-12-01", grade: "6", division: "A", roll: 11,
    blood: "A+", heightCm: 144, weightKg: 36, guardian: ["Yuki Nakajima", "Mother"],
    conditions: ["Asthma"],
    hfiles: {
      lastSyncedAt: "2026-09-02T07:50:00Z",
      allergies: ["Latex"],
      immunizations: [{ vaccine: "Influenza", dose: "Annual 2026", date: "2026-04-22", provider: "Aster Clinic" }],
    },
  },
  {
    seq: 14, name: "Sophia Lin", gender: "female", dob: "2014-06-16", grade: "7", division: "A", roll: 19,
    blood: "AB-", heightCm: 151, weightKg: 41, guardian: ["Wei Lin", "Father"],
    vision: "6/9", allergies: ["Pollen"],
    hfiles: {
      lastSyncedAt: "2026-08-14T12:10:00Z",
      allergies: ["Pollen"],
      labReports: [{ name: "Eye examination", date: "2026-08-10", lab: "Sankara Eye Centre", summary: "Mild myopia, −0.75D both eyes." }],
    },
  },
  {
    seq: 15, name: "Aditya Rao", gender: "male", dob: "2014-01-29", grade: "7", division: "A", roll: 2,
    blood: "B+", heightCm: 153, weightKg: 44, guardian: ["Shalini Rao", "Mother"],
    hearing: "needs-review", conditions: ["Epilepsy"], notes: "Seizure action plan on file. Levetiracetam twice daily at home.",
  },
  {
    seq: 16, name: "Alex Bennett", gender: "male", dob: "2013-02-11", grade: "8", division: "B", roll: 14,
    blood: "O+", heightCm: 158, weightKg: 47, guardian: ["Laura Bennett", "Mother"],
    allergies: ["Peanuts", "Penicillin", "Pollen"],
    surgeries: [
      { name: "Appendectomy", date: "2021-05-12", hospital: "Kokilaben Hospital", outcome: "successful" },
      { name: "Tonsillectomy", date: "2018-08-04", hospital: "Kokilaben Hospital", outcome: "successful" },
    ],
    notes: "Anaphylaxis risk — requires immediate EpiPen administration.",
    hfiles: {
      lastSyncedAt: "2026-09-27T18:22:00Z",
      allergies: ["Peanuts", "Penicillin"],
      immunizations: [
        { vaccine: "Tdap", dose: "Booster", date: "2024-03-08", provider: "Kokilaben Hospital" },
        { vaccine: "HPV", dose: "Dose 1", date: "2025-02-17", provider: "Kokilaben Hospital" },
      ],
    },
  },
  {
    seq: 17, name: "Zara Khan", gender: "female", dob: "2013-09-07", grade: "8", division: "B", roll: 22,
    blood: "A+", heightCm: 156, weightKg: 45, guardian: ["Imran Khan", "Father"],
    conditions: ["Migraine"],
  },
  {
    seq: 18, name: "Rohan Desai", gender: "male", dob: "2012-04-23", grade: "9", division: "A", roll: 8,
    blood: "B+", heightCm: 165, weightKg: 52, guardian: ["Kiran Desai", "Mother"],
    vision: "6/9", allergies: ["Penicillin"],
    surgeries: [{ name: "Tonsillectomy", date: "2019-11-02", hospital: "Jaslok Hospital", outcome: "successful" }],
  },
  {
    seq: 19, name: "Kiara Malhotra", gender: "female", dob: "2012-10-14", grade: "9", division: "A", roll: 15,
    blood: "O+", heightCm: 160, weightKg: 50, guardian: ["Ritu Malhotra", "Mother"],
    conditions: ["Type 1 diabetes"], notes: "Checks glucose before lunch in the health centre.",
    familyHistory: { maternal: ["Type 2 diabetes"], paternal: [] },
    hfiles: {
      lastSyncedAt: "2026-09-21T09:35:00Z",
      labReports: [{ name: "HbA1c", date: "2026-07-03", lab: "Metropolis Labs", summary: "HbA1c 8.1% — above target, endocrinologist reviewing." }],
    },
  },
  {
    seq: 20, name: "Aryan Chopra", gender: "male", dob: "2011-07-08", grade: "10", division: "A", roll: 3,
    blood: "A-", heightCm: 171, weightKg: 60, guardian: ["Vivek Chopra", "Father"],
    allergies: ["Peanuts"],
    hfiles: {
      lastSyncedAt: "2026-06-30T15:00:00Z",
      allergies: ["Peanuts"],
      immunizations: [{ vaccine: "HPV", dose: "Dose 2", date: "2025-09-12", provider: "Breach Candy Hospital" }],
    },
  },
  {
    seq: 21, name: "Nisha Verma", gender: "female", dob: "2011-11-19", grade: "10", division: "A", roll: 24,
    blood: "B-", heightCm: 162, weightKg: 54, guardian: ["Anjali Verma", "Mother"],
    allergies: ["Shellfish"],
  },
  {
    seq: 22, name: "Dev Agarwal", gender: "male", dob: "2010-05-02", grade: "11", division: "A", roll: 6,
    blood: "O+", heightCm: 175, weightKg: 66, guardian: ["Rajesh Agarwal", "Father"],
    allergies: ["Dust mites"], conditions: ["Asthma"],
    hfiles: {
      lastSyncedAt: "2026-09-10T10:15:00Z",
      allergies: ["Dust mites"],
      labReports: [{ name: "Chest X-ray", date: "2026-01-25", lab: "Hinduja Hospital", summary: "No acute findings." }],
    },
  },
  {
    seq: 23, name: "Tara Menon", gender: "female", dob: "2010-08-28", grade: "11", division: "A", roll: 17,
    blood: "AB+", heightCm: 163, weightKg: 55, guardian: ["Deepa Menon", "Mother"],
    allergies: ["Pollen"],
  },
  {
    seq: 24, name: "Karan Bhatia", gender: "male", dob: "2009-03-13", grade: "12", division: "A", roll: 5,
    blood: "A+", heightCm: 178, weightKg: 70, guardian: ["Sunil Bhatia", "Father"],
    conditions: ["Type 1 diabetes"],
    hfiles: {
      lastSyncedAt: "2026-09-24T17:05:00Z",
      immunizations: [{ vaccine: "Hepatitis B", dose: "Booster", date: "2025-05-06", provider: "Lilavati Hospital" }],
      labReports: [{ name: "HbA1c", date: "2026-08-19", lab: "Thyrocare", summary: "HbA1c 6.9% — well controlled." }],
    },
  },
  {
    seq: 25, name: "Meera Pillai", gender: "female", dob: "2009-12-04", grade: "12", division: "A", roll: 20,
    blood: "B+", heightCm: 161, weightKg: 52, guardian: ["Gopal Pillai", "Father"],
    conditions: ["Migraine"],
    surgeries: [{ name: "Appendectomy", date: "2022-02-18", hospital: "Nanavati Hospital", outcome: "successful" }],
    hfiles: {
      lastSyncedAt: "2026-09-05T08:45:00Z",
      immunizations: [{ vaccine: "HPV", dose: "Dose 2", date: "2024-10-21", provider: "Nanavati Hospital" }],
    },
  },
];
