import { cn } from "@/lib/utils";

/** Quiet loading placeholder; the pulse is disabled under reduced motion by the global rule. */
export function SkeletonBlock({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-lg bg-surface", className)} />;
}
