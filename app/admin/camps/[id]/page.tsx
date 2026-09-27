import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { CampDetail } from "./_components/camp-detail";

export const metadata: Metadata = { title: "Health camp" };

export default async function CampPage({ params }: PageProps<"/admin/camps/[id]">) {
  const { id } = await params;
  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-5 w-56" />
          <SkeletonBlock className="h-14 w-96" />
          <SkeletonBlock className="h-32 w-full rounded-xl" />
          <SkeletonBlock className="h-72 w-full rounded-xl" />
        </div>
      }
    >
      <CampDetail id={id} />
    </HydrationGate>
  );
}
