import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { parseGrade } from "@/lib/types/grade";
import { InsightHeader } from "../_components/insight-header";
import { InsightSkeleton } from "../_components/insight-skeleton";
import { SharedView } from "./_components/shared-view";

export const metadata: Metadata = { title: "Reports shared" };

export default async function ReportsSharedPage({ searchParams }: PageProps<"/admin/insights/reports-shared">) {
  const grade = parseGrade((await searchParams).grade);
  return (
    <div className="flex flex-col gap-6">
      <InsightHeader
        title="Reports shared"
        description="Everything that reached families through hfiles.in — uploaded reports and screening results — newest first."
        grade={grade}
        clearGradeHref="/admin/insights/reports-shared"
      />
      <HydrationGate fallback={<InsightSkeleton />}>
        <SharedView grade={grade} />
      </HydrationGate>
    </div>
  );
}
