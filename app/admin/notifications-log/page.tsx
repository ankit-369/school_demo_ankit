import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { NotificationsLogView } from "./_components/notifications-log-view";

export const metadata: Metadata = { title: "Notifications log" };

export default function NotificationsLogPage() {
  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-14 w-96" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <NotificationsLogView />
    </HydrationGate>
  );
}
