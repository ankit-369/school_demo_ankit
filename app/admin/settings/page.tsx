import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { SettingsGeneralView } from "./_components/settings-general-view";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <HydrationGate
      fallback={
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonBlock className="h-64 rounded-xl" />
          <SkeletonBlock className="h-64 rounded-xl" />
        </div>
      }
    >
      <SettingsGeneralView />
    </HydrationGate>
  );
}
