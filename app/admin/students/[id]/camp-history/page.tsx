import type { Metadata } from "next";
import { CampHistoryTab } from "../_components/camps/camp-history-tab";

export const metadata: Metadata = { title: "Camp history" };

export default function StudentCampHistoryPage() {
  return <CampHistoryTab />;
}
