import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { ScreeningResults } from "./_components/screening-results";

export const metadata: Metadata = { title: "Screening results" };

export default async function ScreeningResultsPage({ params, searchParams }: PageProps<"/admin/camps/[id]/[screeningId]">) {
  const { id, screeningId } = await params;
  const { class: classFilter } = await searchParams;

  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-5 w-80" />
          <SkeletonBlock className="h-14 w-96" />
          <SkeletonBlock className="h-32 w-full rounded-xl" />
          <SkeletonBlock className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <ScreeningResults campId={id} screeningId={screeningId} classFilter={typeof classFilter === "string" ? classFilter : undefined} />
    </HydrationGate>
  );
}
