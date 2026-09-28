"use client";

import { ClipboardX } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";
import { Panel } from "@/components/ui/panel";
import { formatDate, formatDateRange } from "@/lib/format";
import { screenedThisYear } from "@/lib/selectors/insights-screened";
import { useAppStore } from "@/lib/store/app-store";
import type { Grade } from "@/lib/types/grade";
import { ScreeningDetails } from "./screening-details";

export function ScreenedView({ grade }: { grade: Grade | null }) {
  const camps = useAppStore((s) => s.camps);
  const students = useAppStore((s) => s.students);
  const year = new Date().getFullYear();
  const { groups, distinctStudents } = useMemo(() => screenedThisYear(camps, students, year, grade), [camps, students, year, grade]);
  const checks = groups.flatMap((g) => g.dates.flatMap((d) => d.screenings.flatMap((s) => s.rows)));

  if (groups.length === 0) {
    return <EmptyState icon={ClipboardX} title={`No screenings recorded in ${year}`} description="Results appear here as soon as a screening is recorded." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <KpiBand className="grid-cols-3 md:grid-cols-3 xl:grid-cols-3">
        <KpiTile label="Students screened" value={distinctStudents} hint={`in ${year}`} />
        <KpiTile label="Checks done" value={checks.length} />
        <KpiTile label="Follow-ups" value={checks.filter((c) => c.result.status === "follow-up").length} />
      </KpiBand>
      {groups.map(({ camp, dates, studentCount }) => (
        <Panel
          key={camp.id}
          title={camp.name}
          description={`${formatDateRange(camp.startDate, camp.endDate)} · ${studentCount} students screened`}
          bodyClassName="gap-6"
        >
          {dates.map(({ date, screenings }) => (
            <section key={date} className="flex flex-col gap-2" aria-label={formatDate(date)}>
              <h3 className="text-sm font-medium text-ink-soft">{formatDate(date)}</h3>
              {screenings.map((item) => (
                <ScreeningDetails key={item.screening.id} item={item} campId={camp.id} />
              ))}
            </section>
          ))}
        </Panel>
      ))}
    </div>
  );
}
