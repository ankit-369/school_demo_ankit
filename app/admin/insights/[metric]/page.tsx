import Link from "next/link";
import { ChartNoAxesColumn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

const TITLES: Record<string, string> = {
  students: "Total students",
  camps: "Health camps",
  screened: "Screened this year",
  "reports-shared": "Reports shared",
  "reports-pending": "Pending reports",
  conditions: "Medical conditions",
};

/** Stub drill-down so dashboard tiles resolve; the real views arrive in Phase 4. */
export default async function InsightPage({ params, searchParams }: PageProps<"/admin/insights/[metric]">) {
  const { metric } = await params;
  const { grade } = await searchParams;
  const title = TITLES[metric] ?? "Insight";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={title} description={grade ? `Filtered to class ${grade}` : "Whole school"} />
      <div className="rounded-xl border border-dashed border-line">
        <EmptyState
          icon={ChartNoAxesColumn}
          title="Drill-down coming soon"
          description="This breakdown is built in a later phase."
          action={
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">Back to dashboard</Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
