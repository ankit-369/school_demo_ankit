"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store/app-store";
import { studentTimeline } from "@/lib/selectors/timeline";
import { useCurrentStudent } from "../student-context";
import { EmergencyCard } from "./emergency-card";
import { ParticularsCard } from "./particulars-card";
import { RecentTimeline } from "./recent-timeline";
import { VitalsBand } from "./vitals-band";

export function OverviewTab() {
  const student = useCurrentStudent();
  const camps = useAppStore((s) => s.camps);
  const notes = useAppStore((s) => s.notes);
  const reports = useAppStore((s) => s.reports);
  const timeline = useMemo(
    () => studentTimeline(student, { camps, notes, reports }),
    [student, camps, notes, reports],
  );

  return (
    <div className="flex flex-col gap-6">
      <VitalsBand student={student} />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <EmergencyCard student={student} />
          <ParticularsCard student={student} />
        </div>
        <div className="lg:col-span-3">
          <RecentTimeline items={timeline} />
        </div>
      </div>
    </div>
  );
}
