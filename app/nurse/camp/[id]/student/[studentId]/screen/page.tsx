import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { ScreenView } from "../../../_components/screen-view";

export const metadata: Metadata = { title: "Screen student" };

export default async function ScreenPage({ params, searchParams }: PageProps<"/nurse/camp/[id]/student/[studentId]/screen">) {
  const { id, studentId } = await params;
  const { s } = await searchParams;
  return (
    <HydrationGate fallback={<div className="flex flex-col gap-4"><SkeletonBlock className="h-24 rounded-xl" /><SkeletonBlock className="h-20 rounded-xl" /><SkeletonBlock className="h-40 rounded-xl" /></div>}>
      <ScreenView campId={id} studentId={studentId} stationId={typeof s === "string" ? s : undefined} />
    </HydrationGate>
  );
}
