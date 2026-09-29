import type { NewStudentInput } from "@/lib/store/slices/students-slice";
import { DIVISIONS, GRADES, type Division, type Grade } from "@/lib/types/grade";
import type { BloodGroup, House, Student } from "@/lib/types/student";
import type { ColumnMapping, ImportFieldKey } from "./import-fields";

export type DraftValues = Record<ImportFieldKey, string>;

export type ImportRowResult = {
  line: number;
  input?: NewStudentInput;
  errors: string[];
};

/** One editable row in the review step; `id` is stable across edits, reorders and undo. */
export type DraftRow = { id: string; values: DraftValues };

export function newRowId() {
  return `row-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

const FIELD_KEYS: ImportFieldKey[] = [
  "name", "dob", "gender", "grade", "division", "rollNumber", "bloodGroup", "heightCm", "weightKg",
  "allergies", "conditions", "guardianName", "guardianPhone",
];

export function emptyDraftValues(): DraftValues {
  return Object.fromEntries(FIELD_KEYS.map((k) => [k, ""])) as DraftValues;
}

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

function parseGenderLoose(v: string): "Male" | "Female" | null {
  const g = v.trim().toLowerCase();
  if (["m", "male", "boy"].includes(g)) return "Male";
  if (["f", "female", "girl"].includes(g)) return "Female";
  return null;
}

function parseBlood(v: string): BloodGroup | null {
  const b = v.toUpperCase().replace(/\s+/g, "").replace(/VE$/, "").replace(/POS(ITIVE)?$/, "+").replace(/NEG(ATIVE)?$/, "-");
  return BLOOD.includes(b as BloodGroup) ? (b as BloodGroup) : null;
}

const list = (v: string) => v.split(/[;|]/).map((x) => x.trim()).filter(Boolean).map((x) => x.charAt(0).toUpperCase() + x.slice(1));

/**
 * Extracts one row's field values from the raw CSV cells, using the column
 * mapping chosen in step 2. Grade/division/gender/blood group are
 * normalised to their canonical form where possible (e.g. "Grade 8" → "8",
 * "Male" stays "Male") so the review step's dropdowns start pre-selected;
 * an unrecognised value is left as-is so its error message stays useful.
 */
export function toDraftValues(cells: string[], mapping: ColumnMapping): DraftValues {
  const values = emptyDraftValues();
  FIELD_KEYS.forEach((k) => {
    values[k] = mapping[k] >= 0 ? (cells[mapping[k]] ?? "").trim() : "";
  });
  values.grade = parseGradeLoose(values.grade) ?? values.grade;
  values.division = (DIVISIONS as readonly string[]).includes(values.division.toUpperCase()) ? values.division.toUpperCase() : values.division;
  values.gender = parseGenderLoose(values.gender) ?? values.gender;
  values.bloodGroup = parseBlood(values.bloodGroup) ?? values.bloodGroup;
  return values;
}

/** A row's grade/division/roll, used for the duplicate-roll-in-class check. */
export type RollKey = { id: string; grade: Grade; division: Division; roll: number };

/**
 * Validates one draft row. `existing` catches a student already in the
 * directory (same name+DOB, or the same roll already used in that class);
 * `otherRows` (every OTHER row's RollKey, `rowId` already excluded) catches
 * two rows in this same import clashing on a roll number.
 */
export function validateDraftRow(values: DraftValues, rowId: string, line: number, existing: Student[], otherRows: RollKey[]): ImportRowResult {
  const get = (k: ImportFieldKey) => (values[k] ?? "").trim();
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

  if (grade && division && rollNumber !== undefined) {
    const inSameClass = (s: Student) => s.status === "active" && s.grade === grade && s.division === division && s.rollNumber === rollNumber;
    const clash =
      existing.some(inSameClass) || otherRows.some((r) => r.id !== rowId && r.grade === grade && r.division === division && r.roll === rollNumber);
    if (clash) errors.push(`Roll ${rollNumber} is already used in ${grade}-${division}`);
  }

  const duplicate = Boolean(name && dob) && existing.some((s) => s.status === "active" && s.name.toLowerCase() === name.toLowerCase() && s.dob === dob);
  if (duplicate) errors.push("Already in the directory (same name and date of birth)");

  if (errors.length) return { line, errors };

  return {
    line,
    errors: [],
    input: {
      name, dob: dob!, gender: gender as "male" | "female", grade: grade!, division: division!, rollNumber: rollNumber!,
      bloodGroup: bloodGroup!, heightCm: heightCm!, weightKg: weightKg!, vision: "6/6", hearing: "normal",
      house: HOUSES[line % HOUSES.length], transport: "school-bus",
      guardian: { name: guardianName, relation: "Guardian", phone },
      emergencyContact: { name: guardianName, relation: "Guardian", phone },
      school: { allergies: list(get("allergies")), conditions: list(get("conditions")), notes: "" },
    },
  };
}
