import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { ImportWizard } from "./_components/import-wizard";

export const metadata: Metadata = { title: "Import students" };

export default function ImportStudentsPage() {
  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-5 w-56" />
          <SkeletonBlock className="h-14 w-96" />
          <SkeletonBlock className="h-72 w-full rounded-xl" />
        </div>
      }
    >
      <ImportWizard />
    </HydrationGate>
  );
}
