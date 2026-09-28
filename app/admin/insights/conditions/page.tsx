import type { Metadata } from "next";
import { Suspense } from "react";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { InsightSkeleton } from "../_components/insight-skeleton";
import { ConditionsView } from "./_components/conditions-view";

export const metadata: Metadata = { title: "Medical conditions" };

export default function ConditionsPage() {
  return (
    <Suspense fallback={<InsightSkeleton />}>
      <HydrationGate fallback={<InsightSkeleton />}>
        <ConditionsView />
      </HydrationGate>
    </Suspense>
  );
}
