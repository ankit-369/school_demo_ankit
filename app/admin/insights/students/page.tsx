import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { gradeLabel, parseGrade } from "@/lib/types/grade";
import { StudentDirectory } from "../../students/_components/student-directory";
import { InsightHeader } from "../_components/insight-header";
import { InsightSkeleton } from "../_components/insight-skeleton";

export const metadata: Metadata = { title: "Total students" };

/** The student directory, preset to the dashboard's class filter (if any). */
export default async function StudentsInsightPage({ searchParams }: PageProps<"/admin/insights/students">) {
  const grade = parseGrade((await searchParams).grade);
  return (
    <div className="flex flex-col gap-6">
      <InsightHeader
        title="Total students"
        description={grade ? `Active students in ${gradeLabel(grade)}. Adjust the filters to widen the list.` : "Every active student. Filter by class, division or health flag."}
        grade={grade}
        clearGradeHref="/admin/insights/students"
      />
      <HydrationGate fallback={<InsightSkeleton />}>
        <StudentDirectory key={grade ?? "all"} embedded initialFilters={{ grade: grade ?? "" }} />
      </HydrationGate>
    </div>
  );
}
