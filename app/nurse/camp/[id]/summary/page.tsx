import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { SummaryView } from "../_components/summary-view";

export const metadata: Metadata = { title: "Summary" };

export default async function SummaryPage({ params, searchParams }: PageProps<"/nurse/camp/[id]/summary">) {
  const { id } = await params;
  const { s } = await searchParams;
  return (
    <HydrationGate fallback={<div className="flex flex-col gap-4"><SkeletonBlock className="h-24" /><SkeletonBlock className="h-32 rounded-xl" /><SkeletonBlock className="h-48 rounded-xl" /></div>}>
      <SummaryView campId={id} stationId={typeof s === "string" ? s : undefined} />
    </HydrationGate>
  );
}
