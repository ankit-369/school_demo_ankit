"use client";

import { CalendarX } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { TabNav } from "@/components/ui/tab-nav";
import { useAppStore } from "@/lib/store/app-store";
import { campPhase } from "@/lib/selectors/camps";
import { CampCard } from "./camp-card";
import { ScheduleCampDialog } from "./schedule-camp/schedule-camp-dialog";

export type CampsTab = "upcoming" | "completed";

export function CampsView({ tab }: { tab: CampsTab }) {
  const camps = useAppStore((s) => s.camps);
  const students = useAppStore((s) => s.students);

  const { upcoming, completed } = useMemo(() => {
    const byStart = [...camps].sort((a, b) => a.startDate.localeCompare(b.startDate));
    return {
      // In-progress camps sort first because they started earliest.
      upcoming: byStart.filter((c) => campPhase(c) !== "completed"),
      completed: byStart.filter((c) => campPhase(c) === "completed").reverse(),
    };
  }, [camps]);
  const list = tab === "completed" ? completed : upcoming;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Health camps" description="Plan screenings, track progress and share results with families." actions={<ScheduleCampDialog />} />
      <TabNav
        label="Camp status"
        activeHref={`/admin/camps?tab=${tab}`}
        items={[
          { href: "/admin/camps?tab=upcoming", label: `Upcoming & ongoing (${upcoming.length})` },
          { href: "/admin/camps?tab=completed", label: `Completed (${completed.length})` },
        ]}
      />
      {list.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title={tab === "completed" ? "No completed camps yet" : "Nothing scheduled"}
          description={tab === "completed" ? "Finished camps and their results will appear here." : "Schedule a camp to start planning screenings."}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((c) => (
            <CampCard key={c.id} camp={c} students={students} />
          ))}
        </div>
      )}
    </div>
  );
}
