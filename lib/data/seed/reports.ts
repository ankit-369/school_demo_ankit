import type { Report } from "@/lib/types/report";
import { studentId } from "./student-factory";

export const seedReports: Report[] = [
  { id: "rep-01", studentId: studentId(16), fileName: "Dental_screening_Jul2026.pdf", category: "screening", uploadDate: "2026-07-16T10:30:00Z", size: 482_133, uploadedBy: "Nurse Chloe Simm", syncedToHfiles: true },
  { id: "rep-02", studentId: studentId(9), fileName: "HbA1c_Jun2026.pdf", category: "lab", uploadDate: "2026-06-15T09:00:00Z", size: 211_870, uploadedBy: "Nurse Chloe Simm", syncedToHfiles: true },
  { id: "rep-03", studentId: studentId(5), fileName: "Asthma_action_plan.pdf", category: "prescription", uploadDate: "2026-08-04T12:15:00Z", size: 156_402, uploadedBy: "Nurse Chloe Simm", syncedToHfiles: false },
  { id: "rep-04", studentId: studentId(11), fileName: "Eye_prescription.jpg", category: "prescription", uploadDate: "2026-07-22T08:45:00Z", size: 1_204_551, uploadedBy: "Nurse Farah Siddiqui", syncedToHfiles: false },
  { id: "rep-05", studentId: studentId(24), fileName: "Endocrinology_review.pdf", category: "lab", uploadDate: "2026-08-20T14:05:00Z", size: 389_004, uploadedBy: "Nurse Chloe Simm", syncedToHfiles: true },
  { id: "rep-06", studentId: studentId(12), fileName: "Allergy_test_results.pdf", category: "lab", uploadDate: "2026-09-03T11:00:00Z", size: 298_760, uploadedBy: "Nurse Chloe Simm", syncedToHfiles: false },
  { id: "rep-07", studentId: studentId(15), fileName: "Seizure_action_plan.pdf", category: "other", uploadDate: "2026-06-10T09:30:00Z", size: 142_318, uploadedBy: "Mr. Vikram Bose", syncedToHfiles: false },
];
