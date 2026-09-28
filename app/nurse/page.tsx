import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { NurseHome } from "./_components/nurse-home";

export default function NursePage() {
  return (
    <HydrationGate fallback={<div className="flex flex-col gap-4"><SkeletonBlock className="h-14 w-72" /><SkeletonBlock className="h-28 rounded-xl" /></div>}>
      <NurseHome />
    </HydrationGate>
  );
}
