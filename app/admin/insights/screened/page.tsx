import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { gradeLabel, parseGrade } from "@/lib/types/grade";
import { InsightHeader } from "../_components/insight-header";
import { InsightSkeleton } from "../_components/insight-skeleton";
import { ScreenedView } from "./_components/screened-view";

export const metadata: Metadata = { title: "Screened this year" };

export default async function ScreenedPage({ searchParams }: PageProps<"/admin/insights/screened">) {
  const grade = parseGrade((await searchParams).grade);
  return (
    <div className="flex flex-col gap-6">
      <InsightHeader
        title="Screened this year"
        description={`Students with a recorded result${grade ? ` in ${gradeLabel(grade)}` : ""}, grouped by camp and date. Expand a screening to see who.`}
        grade={grade}
        clearGradeHref="/admin/insights/screened"
      />
      <HydrationGate fallback={<InsightSkeleton />}>
        <ScreenedView grade={grade} />
      </HydrationGate>
    </div>
  );
}
