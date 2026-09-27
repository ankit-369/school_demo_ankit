import type { Metadata } from "next";
import { ReportsTab } from "../_components/reports/reports-tab";

export const metadata: Metadata = { title: "Reports" };

export default function StudentReportsPage() {
  return <ReportsTab />;
}
