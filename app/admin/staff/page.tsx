import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { StaffDirectory } from "./_components/staff-directory";

export const metadata: Metadata = { title: "Staff" };

export default function StaffPage() {
  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-14 w-80" />
          <SkeletonBlock className="h-10 w-80" />
          <SkeletonBlock className="h-40 w-full rounded-xl" />
          <SkeletonBlock className="h-64 w-full rounded-xl" />
        </div>
      }
    >
      <StaffDirectory />
    </HydrationGate>
  );
}
