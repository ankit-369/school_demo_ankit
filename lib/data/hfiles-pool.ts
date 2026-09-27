import type { Immunization, LabReport } from "@/lib/types/medical-history";

/**
 * Plausible records a mock "Sync from hfiles.in" can pull in. Each sync takes
 * the first entries the student doesn't already have. Allergies are never
 * invented — that would be clinically misleading, even in a demo.
 */
export const HFILES_IMMUNIZATION_POOL: Omit<Immunization, "id" | "date">[] = [
  { vaccine: "Influenza", dose: "Annual 2026", provider: "Apollo Clinic" },
  { vaccine: "Typhoid conjugate", dose: "Booster", provider: "Rainbow Children's Hospital" },
  { vaccine: "Tdap", dose: "Booster", provider: "Fortis Hospital" },
  { vaccine: "Hepatitis A", dose: "Dose 2", provider: "Max Healthcare" },
];

export const HFILES_LAB_POOL: Omit<LabReport, "id" | "date">[] = [
  { name: "Complete blood count", lab: "Thyrocare", summary: "All values within normal range." },
  { name: "Vitamin D (25-OH)", lab: "SRL Diagnostics", summary: "22 ng/mL — mild insufficiency; supplement advised." },
  { name: "Lipid profile", lab: "Metropolis Labs", summary: "Within paediatric reference range." },
];
