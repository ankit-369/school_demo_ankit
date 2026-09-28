import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { RosterView } from "../_components/roster-view";

export const metadata: Metadata = { title: "Roster" };

export default async function RosterPage({ params, searchParams }: PageProps<"/nurse/camp/[id]/roster">) {
  const { id } = await params;
  const { s } = await searchParams;
  return (
    <HydrationGate fallback={<div className="flex flex-col gap-4"><SkeletonBlock className="h-24" /><SkeletonBlock className="h-12 rounded-xl" /><SkeletonBlock className="h-96 rounded-xl" /></div>}>
      <RosterView campId={id} stationId={typeof s === "string" ? s : undefined} />
    </HydrationGate>
  );
}
