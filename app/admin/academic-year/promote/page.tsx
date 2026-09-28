import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { PromotionWizard } from "./_components/promotion-wizard";

export const metadata: Metadata = { title: "Promote academic year" };

export default function PromotePage() {
  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-5 w-64" />
          <SkeletonBlock className="h-14 w-96" />
          <SkeletonBlock className="h-8 w-full" />
          <SkeletonBlock className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <PromotionWizard />
    </HydrationGate>
  );
}
