import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { ReportsCenterView } from "./_components/reports-center-view";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-14 w-72" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <ReportsCenterView />
    </HydrationGate>
  );
}
