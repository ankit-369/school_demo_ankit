import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { PageHeader } from "@/components/ui/page-header";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { DashboardHeaderDescription } from "./_components/dashboard-header-description";
import { DashboardView } from "./_components/dashboard-view";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Hello, Mr. Ankit"
        description={<DashboardHeaderDescription />}
      />
      <HydrationGate
        fallback={
          <div className="flex flex-col gap-4">
            <SkeletonBlock className="h-9 w-full" />
            <SkeletonBlock className="h-64 w-full rounded-xl xl:h-32" />
            <SkeletonBlock className="mt-6 h-72 w-full rounded-xl" />
          </div>
        }
      >
        <DashboardView />
      </HydrationGate>
    </div>
  );
}
