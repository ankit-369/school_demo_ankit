import type { Grade } from "./grade";

export type ScreeningType = "vision" | "dental" | "hearing" | "anthropometry" | "general" | "ent";

export type ScreeningResultStatus = "completed" | "follow-up" | "pending";

export type ScreeningResult = {
  studentId: string;
  status: ScreeningResultStatus;
  notes: string;
  reportUrl?: string;
  /** Set when a promotion archived this entry, e.g. "2026-27". Data is kept; current views hide it by default. */
  archivedYear?: string;
};

export type Screening = {
  id: string;
  campId: string;
  type: ScreeningType;
  leadDoctor: string;
  targetStandards: Grade[];
  date: string;
  results: ScreeningResult[];
};
