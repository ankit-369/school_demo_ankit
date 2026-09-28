export type ImportFieldKey =
  | "name" | "dob" | "gender" | "grade" | "division" | "rollNumber" | "bloodGroup" | "heightCm" | "weightKg"
  | "guardianName" | "guardianRelation" | "guardianPhone" | "house" | "transport" | "allergies" | "conditions" | "notes";

export type ImportField = {
  key: ImportFieldKey;
  label: string;
  required: boolean;
  hint?: string;
  /** Lower-cased header names that auto-map to this field. */
  synonyms: string[];
};

export const IMPORT_FIELDS: ImportField[] = [
  { key: "name", label: "Full name", required: true, synonyms: ["name", "full name", "student name", "student"] },
  { key: "dob", label: "Date of birth", required: true, hint: "YYYY-MM-DD or DD/MM/YYYY", synonyms: ["dob", "date of birth", "birth date", "birthdate"] },
  { key: "gender", label: "Gender", required: true, hint: "Male/Female or M/F", synonyms: ["gender", "sex"] },
  { key: "grade", label: "Class / grade", required: true, hint: "JKG, SKG or 1–12", synonyms: ["grade", "class", "standard", "std"] },
  { key: "division", label: "Division", required: true, hint: "A, B or C", synonyms: ["division", "div", "section"] },
  { key: "rollNumber", label: "Roll no.", required: true, synonyms: ["roll", "roll no", "roll number", "roll no."] },
  { key: "bloodGroup", label: "Blood group", required: true, hint: "e.g. O+, AB-", synonyms: ["blood group", "blood", "blood type"] },
  { key: "heightCm", label: "Height (cm)", required: true, synonyms: ["height", "height (cm)", "height cm"] },
  { key: "weightKg", label: "Weight (kg)", required: true, synonyms: ["weight", "weight (kg)", "weight kg"] },
  { key: "guardianName", label: "Guardian name", required: true, synonyms: ["guardian", "guardian name", "parent", "parent name"] },
  { key: "guardianPhone", label: "Guardian phone", required: true, synonyms: ["phone", "guardian phone", "parent phone", "mobile", "contact"] },
  { key: "guardianRelation", label: "Guardian relation", required: false, hint: "Mother/Father/Guardian", synonyms: ["relation", "relationship", "guardian relation"] },
  { key: "house", label: "House", required: false, synonyms: ["house"] },
  { key: "transport", label: "Transport", required: false, synonyms: ["transport", "commute"] },
  { key: "allergies", label: "Allergies", required: false, hint: "Separate with ; or |", synonyms: ["allergies", "allergy"] },
  { key: "conditions", label: "Conditions", required: false, hint: "Separate with ; or |", synonyms: ["conditions", "condition", "medical conditions"] },
  { key: "notes", label: "Nurse notes", required: false, synonyms: ["notes", "nurse notes", "remarks"] },
];

/** Column index per field (-1 = not mapped). */
export type ColumnMapping = Record<ImportFieldKey, number>;

const norm = (h: string) => h.trim().toLowerCase().replace(/[_\-.]+/g, " ").replace(/\s+/g, " ");

/** Matches CSV headers to fields by name/synonym; each column is used at most once. */
export function autoMap(headers: string[]): ColumnMapping {
  const used = new Set<number>();
  const mapping = {} as ColumnMapping;
  for (const field of IMPORT_FIELDS) {
    const idx = headers.findIndex((h, i) => !used.has(i) && field.synonyms.includes(norm(h)));
    mapping[field.key] = idx;
    if (idx >= 0) used.add(idx);
  }
  return mapping;
}

export function missingRequired(mapping: ColumnMapping) {
  return IMPORT_FIELDS.filter((f) => f.required && mapping[f.key] < 0);
}
