import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { ConsentView } from "./_components/consent-view";

export const metadata: Metadata = { title: "Consent forms" };

export default function ConsentPage() {
  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-14 w-96" />
          <SkeletonBlock className="h-24 w-full rounded-xl" />
          <SkeletonBlock className="h-32 w-full rounded-xl" />
        </div>
      }
    >
      <ConsentView />
    </HydrationGate>
  );
}
