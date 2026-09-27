import type { Grade } from "./grade";

export type ScreeningType = "vision" | "dental" | "hearing" | "anthropometry" | "general" | "ent";

export type ScreeningResultStatus = "completed" | "follow-up" | "pending";

export type ScreeningResult = {
  studentId: string;
  status: ScreeningResultStatus;
  notes: string;
  reportUrl?: string;
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
