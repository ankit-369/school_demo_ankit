import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { IntegrationsView } from "./_components/integrations-view";

export const metadata: Metadata = { title: "Integrations" };

export default function IntegrationsPage() {
  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-40 rounded-xl" />
          <SkeletonBlock className="h-72 rounded-xl" />
        </div>
      }
    >
      <IntegrationsView />
    </HydrationGate>
  );
}
