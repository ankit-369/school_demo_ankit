import type { Metadata } from "next";
import { MedicalHistoryTab } from "../_components/medical/medical-history-tab";

export const metadata: Metadata = { title: "Medical history" };

export default function StudentMedicalHistoryPage() {
  return <MedicalHistoryTab />;
}
