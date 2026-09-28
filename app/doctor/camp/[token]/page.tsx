import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { DoctorCampView } from "./_components/doctor-camp-view";

export const metadata: Metadata = { title: "Camp results" };

export default async function DoctorCampPage({ params }: PageProps<"/doctor/camp/[token]">) {
  const { token } = await params;
  return (
    <HydrationGate fallback={<div className="flex flex-col gap-4"><SkeletonBlock className="h-24" /><SkeletonBlock className="h-12 rounded-xl" /><SkeletonBlock className="h-96 rounded-xl" /></div>}>
      <DoctorCampView token={decodeURIComponent(token)} />
    </HydrationGate>
  );
}
