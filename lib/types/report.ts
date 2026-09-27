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
};
