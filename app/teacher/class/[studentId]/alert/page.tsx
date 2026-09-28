import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { StudentAlert } from "../../../_components/student-alert";

export const metadata: Metadata = { title: "Action card" };

export default async function StudentAlertPage({ params }: PageProps<"/teacher/class/[studentId]/alert">) {
  const { studentId } = await params;
  return (
    <HydrationGate fallback={<div className="flex flex-col gap-4"><SkeletonBlock className="h-20 w-80" /><SkeletonBlock className="h-14 rounded-xl" /><SkeletonBlock className="h-64 rounded-xl" /></div>}>
      <StudentAlert studentId={studentId} />
    </HydrationGate>
  );
}
