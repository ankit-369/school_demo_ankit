import type { Metadata } from "next";
import { OverviewTab } from "./_components/overview/overview-tab";

export const metadata: Metadata = { title: "Student profile" };

export default function StudentOverviewPage() {
  return <OverviewTab />;
}
