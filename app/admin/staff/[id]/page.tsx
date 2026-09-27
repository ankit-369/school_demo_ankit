import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { StaffProfile } from "./_components/staff-profile";

export const metadata: Metadata = { title: "Staff profile" };

export default async function StaffProfilePage({ params }: PageProps<"/admin/staff/[id]">) {
  const { id } = await params;
  return (
    <HydrationGate
      fallback={
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-20 w-96" />
          <SkeletonBlock className="h-[480px] w-full rounded-xl" />
        </div>
      }
    >
      <StaffProfile id={id} />
    </HydrationGate>
  );
}
