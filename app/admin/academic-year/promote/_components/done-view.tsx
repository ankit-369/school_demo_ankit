import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { yearLabel } from "@/lib/academic/promotion-plan";
import { pluralize } from "@/lib/format";
import type { PromotionSummary } from "@/lib/store/slices/academic-slice";

export function DoneView({ summary }: { summary: PromotionSummary }) {
  const { counts, archived } = summary;
  return (
    <EmptyState
      icon={PartyPopper}
      title={`Welcome to ${yearLabel(summary.toYear)}`}
      description={
        <>
          {pluralize(counts.promoted, "student")} promoted, {counts.graduated} graduated, {counts.retained} retained, {counts.transferred} transferred and {counts.exited} exited.{" "}
          {pluralize(archived.results + archived.notes + archived.reports, "entry", "entries")} from {yearLabel(summary.fromYear)} archived.
        </>
      }
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild><Link href="/admin/students">View students</Link></Button>
          <Button asChild variant="outline"><Link href="/admin/dashboard">Back to dashboard</Link></Button>
        </div>
      }
    />
  );
}
