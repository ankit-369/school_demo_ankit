import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { CampsView, type CampsTab } from "./_components/camps-view";

export const metadata: Metadata = { title: "Health camps" };

export default async function CampsPage({ searchParams }: PageProps<"/admin/camps">) {
  const { tab } = await searchParams;
  const active: CampsTab = tab === "completed" ? "completed" : "upcoming";

  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-14 w-80" />
          <SkeletonBlock className="h-11 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonBlock className="h-56 rounded-xl" />
            <SkeletonBlock className="h-56 rounded-xl" />
          </div>
        </div>
      }
    >
      <CampsView tab={active} />
    </HydrationGate>
  );
}
