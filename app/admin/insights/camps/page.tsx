import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { gradeLabel, parseGrade } from "@/lib/types/grade";
import { InsightHeader } from "../_components/insight-header";
import { InsightSkeleton } from "../_components/insight-skeleton";
import { CampsInsight } from "./_components/camps-insight";

export const metadata: Metadata = { title: "Health camps" };

export default async function CampsInsightPage({ searchParams }: PageProps<"/admin/insights/camps">) {
  const grade = parseGrade((await searchParams).grade);
  return (
    <div className="flex flex-col gap-6">
      <InsightHeader
        title="Health camps"
        description={grade ? `Every camp that screened or will screen ${gradeLabel(grade)}.` : "Every camp, newest first — upcoming, running and completed."}
        grade={grade}
        clearGradeHref="/admin/insights/camps"
      />
      <HydrationGate fallback={<InsightSkeleton />}>
        <CampsInsight grade={grade} />
      </HydrationGate>
    </div>
  );
}
