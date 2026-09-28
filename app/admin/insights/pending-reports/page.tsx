import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { parseGrade } from "@/lib/types/grade";
import { InsightHeader } from "../_components/insight-header";
import { InsightSkeleton } from "../_components/insight-skeleton";
import { PendingView } from "./_components/pending-view";

export const metadata: Metadata = { title: "Pending reports" };

export default async function PendingReportsPage({ searchParams }: PageProps<"/admin/insights/pending-reports">) {
  const grade = parseGrade((await searchParams).grade);
  return (
    <div className="flex flex-col gap-6">
      <InsightHeader
        title="Pending reports"
        description="Screening results still to be recorded, and uploads not yet on hfiles.in. Remind a guardian in one tap."
        grade={grade}
        clearGradeHref="/admin/insights/pending-reports"
      />
      <HydrationGate fallback={<InsightSkeleton />}>
        <PendingView grade={grade} />
      </HydrationGate>
    </div>
  );
}
