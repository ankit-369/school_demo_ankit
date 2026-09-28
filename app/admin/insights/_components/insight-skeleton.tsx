import { SkeletonBlock } from "@/components/ui/skeleton-block";

export function InsightSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <SkeletonBlock className="h-5 w-48" />
      <SkeletonBlock className="h-14 w-96" />
      <SkeletonBlock className="h-32 w-full rounded-xl" />
      <SkeletonBlock className="h-80 w-full rounded-xl" />
    </div>
  );
}
