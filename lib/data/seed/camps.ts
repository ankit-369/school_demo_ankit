import type { Camp } from "@/lib/types/camp";
import { GRADES, type Grade } from "@/lib/types/grade";
import type { Screening, ScreeningResult, ScreeningType } from "@/lib/types/screening";
import type { Student } from "@/lib/types/student";
import { studentId } from "./student-factory";

export const CAMP_IDS = { completed: "camp-01", inProgress: "camp-02", upcoming: "camp-03" } as const;

function gradeRange(from: Grade, to: Grade): Grade[] {
  return GRADES.slice(GRADES.indexOf(from), GRADES.indexOf(to) + 1);
}

type ResultRule = (student: Student, index: number) => Omit<ScreeningResult, "studentId">;

function screening(
  campId: string,
  n: number,
  type: ScreeningType,
  leadDoctor: string,
  targetStandards: Grade[],
  date: string,
  students: Student[],
  rule?: ResultRule,
): Screening {
  const id = `${campId}-scr-${n}`;
  const targets = students.filter((s) => targetStandards.includes(s.grade));
  return {
    id,
    campId,
    type,
    leadDoctor,
    targetStandards,
    date,
    results: rule
      ? targets.map((s, i) => {
          const r = rule(s, i);
          return {
            studentId: s.id,
            ...r,
            ...(r.status !== "pending" && { reportUrl: `/reports/${id}/${s.id}.pdf` }),
          };
        })
      : [],
  };
}

const done = (notes = "No concerns noted.") => ({ status: "completed" as const, notes });
const followUp = (notes: string) => ({ status: "follow-up" as const, notes });
const pending = () => ({ status: "pending" as const, notes: "" });

const DENTAL_FOLLOW_UPS: Record<string, string> = {
  [studentId(3)]: "Early caries on lower molars. Refer to paediatric dentist.",
  [studentId(9)]: "Gum inflammation — review brushing technique with parent.",
  [studentId(16)]: "Two cavities detected. Dental visit within 4 weeks.",
  [studentId(21)]: "Crowding of upper incisors; orthodontic consult advised.",
};

export function buildSeedCamps(students: Student[]): Camp[] {
  const c1 = CAMP_IDS.completed;
  const c2 = CAMP_IDS.inProgress;
  const c3 = CAMP_IDS.upcoming;

  return [
    {
      id: c1,
      name: "Annual Health Drive 2026",
      startDate: "2026-07-13",
      endDate: "2026-07-17",
      screenings: [
        screening(c1, 1, "vision", "Dr. Sarah Jenkins", gradeRange("1", "12"), "2026-07-13", students, (s) =>
          s.vision === "6/6" ? done("Snellen 6/6, colour vision normal.") : followUp(`Snellen ${s.vision}. Refer for refraction.`),
        ),
        screening(c1, 2, "dental", "Dr. Amit Patel", gradeRange("JKG", "12"), "2026-07-15", students, (s) =>
          DENTAL_FOLLOW_UPS[s.id] ? followUp(DENTAL_FOLLOW_UPS[s.id]) : done("Oral hygiene good."),
        ),
        screening(c1, 3, "anthropometry", "Nurse Chloe Simm", gradeRange("JKG", "12"), "2026-07-17", students, (s) =>
          done(`Height ${s.heightCm} cm, weight ${s.weightKg} kg, BMI ${s.bmi}.`),
        ),
      ],
    },
    {
      id: c2,
      name: "Monsoon Wellness Check",
      startDate: "2026-09-21",
      endDate: "2026-10-03",
      screenings: [
        screening(c2, 1, "hearing", "Dr. Neha Kulkarni", gradeRange("JKG", "5"), "2026-09-22", students, (s) =>
          s.hearing === "normal" ? done("Pure-tone screen passed both ears.") : followUp("Reduced response on left ear. Audiology referral."),
        ),
        screening(c2, 2, "general", "Dr. Robert Chen", gradeRange("6", "12"), "2026-09-28", students, (s, i) =>
          i % 2 === 0 ? done("Cardiovascular and respiratory exam normal.") : pending(),
        ),
        screening(c2, 3, "ent", "Dr. Elena Rodriguez", gradeRange("9", "12"), "2026-10-02", students, pending),
      ],
    },
    {
      id: c3,
      name: "Winter Screening 2026",
      startDate: "2026-11-16",
      endDate: "2026-11-18",
      screenings: [
        screening(c3, 1, "vision", "Dr. Sarah Jenkins", gradeRange("1", "12"), "2026-11-16", students),
        screening(c3, 2, "dental", "Dr. Amit Patel", gradeRange("JKG", "5"), "2026-11-18", students),
      ],
    },
  ];
}
