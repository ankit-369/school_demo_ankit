import type { Screening } from "./screening";

export type Camp = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  screenings: Screening[];
};

/** Derived from dates, never stored. */
export type CampPhase = "upcoming" | "in-progress" | "completed";
