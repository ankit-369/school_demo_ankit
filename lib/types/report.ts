export type ReportCategory = "lab" | "prescription" | "imaging" | "screening" | "vaccination" | "other";

export type Report = {
  id: string;
  studentId: string;
  fileName: string;
  category: ReportCategory;
  uploadDate: string;
  /** Bytes. */
  size: number;
  uploadedBy: string;
  syncedToHfiles: boolean;
  /** Reviewing or referring doctor, if known. */
  doctor?: string;
  /** Set when a promotion archived this entry, e.g. "2026-27". Data is kept; current views hide it by default. */
  archivedYear?: string;
};
