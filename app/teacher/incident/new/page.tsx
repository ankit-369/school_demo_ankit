import type { Metadata } from "next";
import { HydrationGate } from "@/components/ui/hydration-gate";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { IncidentForm } from "../../_components/incident-form";

export const metadata: Metadata = { title: "Log an incident" };

export default async function NewIncidentPage({ searchParams }: PageProps<"/teacher/incident/new">) {
  const { student } = await searchParams;
  return (
    <HydrationGate fallback={<div className="flex flex-col gap-4"><SkeletonBlock className="h-14 w-72" /><SkeletonBlock className="h-96 rounded-xl" /></div>}>
      <IncidentForm presetStudentId={typeof student === "string" ? student : undefined} />
    </HydrationGate>
  );
}
