import type { NewStudentInput } from "@/lib/store/slices/students-slice";
import { DIVISIONS, GRADES, type Division, type Grade } from "@/lib/types/grade";
import type { BloodGroup, Guardian, House, Student, Transport } from "@/lib/types/student";
import type { ColumnMapping, ImportFieldKey } from "./import-fields";

export type ImportRowResult = {
  line: number;
  input?: NewStudentInput;
  errors: string[];
  duplicate?: boolean;
};

const HOUSES: House[] = ["Ganga", "Yamuna", "Kaveri", "Narmada"];
const BLOOD: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function parseDate(v: string): string | null {
  const iso = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const dmy = v.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  const parts = iso ? [iso[1], iso[2], iso[3]] : dmy ? [dmy[3], dmy[2], dmy[1]] : null;
  if (!parts) return null;
  const [y, m, d] = parts;
  const out = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  const date = new Date(`${out}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== out ? null : out;
}

function parseGradeLoose(v: string): Grade | null {
  const g = v.trim().toUpperCase().replace(/^(GRADE|CLASS|STD\.?)\s*/, "");
  return (GRADES as readonly string[]).includes(g) ? (g as Grade) : null;
}

function parseBlood(v: string): BloodGroup | null {
  const b = v.toUpperCase().replace(/\s+/g, "").replace(/VE$/, "").replace(/POS(ITIVE)?$/, "+").replace(/NEG(ATIVE)?$/, "-");
  return BLOOD.includes(b as BloodGroup) ? (b as BloodGroup) : null;
}

const list = (v: string) => v.split(/[;|]/).map((x) => x.trim()).filter(Boolean).map((x) => x.charAt(0).toUpperCase() + x.slice(1));

/** Validates and converts one CSV row; `existing` is used to flag duplicates (same name + DOB). */
export function normalizeRow(cells: string[], line: number, mapping: ColumnMapping, existing: Student[]): ImportRowResult {
  const get = (k: ImportFieldKey) => (mapping[k] >= 0 ? (cells[mapping[k]] ?? "").trim() : "");
  const errors: string[] = [];
  const need = <T,>(label: string, raw: string, parsed: T | null): T | undefined => {
    if (!raw) errors.push(`${label} is missing`);
    else if (parsed === null) errors.push(`${label} "${raw}" isn't valid`);
    return parsed ?? undefined;
  };

  const name = get("name");
  if (name.length < 2) errors.push("Name is missing");
  const dob = need("Date of birth", get("dob"), parseDate(get("dob")));
  const g = get("gender").toLowerCase();
  const gender = need("Gender", get("gender"), ["m", "male", "boy"].includes(g) ? "male" : ["f", "female", "girl"].includes(g) ? "female" : null);
  const grade = need("Class", get("grade"), parseGradeLoose(get("grade")));
  const divRaw = get("division").toUpperCase();
  const division = need("Division", get("division"), (DIVISIONS as readonly string[]).includes(divRaw) ? (divRaw as Division) : null);
  const roll = Number(get("rollNumber"));
  const rollNumber = need("Roll no.", get("rollNumber"), Number.isInteger(roll) && roll > 0 && roll < 100 ? roll : null);
  const bloodGroup = need("Blood group", get("bloodGroup"), parseBlood(get("bloodGroup")));
  const h = Number(get("heightCm"));
  const heightCm = need("Height", get("heightCm"), h >= 60 && h <= 220 ? h : null);
  const w = Number(get("weightKg"));
  const weightKg = need("Weight", get("weightKg"), w >= 8 && w <= 150 ? w : null);
  const guardianName = get("guardianName");
  if (guardianName.length < 2) errors.push("Guardian name is missing");
  const phone = get("guardianPhone");
  if (!/^\+?[\d\s-]{10,16}$/.test(phone)) errors.push(phone ? `Phone "${phone}" isn't valid` : "Guardian phone is missing");

  if (errors.length) return { line, errors };

  const rel = get("guardianRelation").toLowerCase();
  const relation: Guardian["relation"] = rel === "mother" ? "Mother" : rel === "father" ? "Father" : "Guardian";
  const house = HOUSES.find((x) => x.toLowerCase() === get("house").toLowerCase()) ?? HOUSES[line % HOUSES.length];
  const t = get("transport").toLowerCase();
  const transport: Transport = t.includes("bus") ? "school-bus" : t.includes("walk") ? "walker" : t ? "private" : "school-bus";
  const duplicate = existing.some((s) => s.name.toLowerCase() === name.toLowerCase() && s.dob === dob);

  return {
    line,
    duplicate,
    errors: duplicate ? ["Already in the directory (same name and date of birth)"] : [],
    input: {
      name, dob: dob!, gender: gender as "male" | "female", grade: grade!, division: division!, rollNumber: rollNumber!,
      bloodGroup: bloodGroup!, heightCm: heightCm!, weightKg: weightKg!, vision: "6/6", hearing: "normal", house, transport,
      guardian: { name: guardianName, relation, phone },
      school: { allergies: list(get("allergies")), conditions: list(get("conditions")), notes: get("notes") },
    },
  };
}
