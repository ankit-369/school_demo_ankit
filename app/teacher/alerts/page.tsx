import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { ClassRoster } from "../_components/class-roster";

export const metadata: Metadata = { title: "Health alerts" };

export default function TeacherAlertsPage() {
  return (
    <HydrationGate fallback={<div className="flex flex-col gap-4"><SkeletonBlock className="h-14 w-72" /><SkeletonBlock className="h-96 rounded-xl" /></div>}>
      <ClassRoster alertsOnly />
    </HydrationGate>
  );
}
