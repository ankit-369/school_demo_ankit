"use client";

import Link from "next/link";
import { CalendarX, Radio } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";
import { Panel } from "@/components/ui/panel";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { isAbsent, isToDo, screenHref, stationHref, stationProgress } from "@/lib/selectors/camp-day";
import { isScreened } from "@/lib/selectors/screening-results";
import { cn } from "@/lib/utils";
import { CampDayHeader } from "./camp-day-header";
import { useCampDay } from "./use-camp-day";

/** Reads straight from the store (and other tabs via the storage listener), so it updates as results land. */
export function SummaryView({ campId, stationId }: { campId: string; stationId?: string }) {
  const { camp, station, rows, students } = useCampDay(campId, stationId);
  const stations = useMemo(() => (camp ? stationProgress(camp, students) : []), [camp, students]);

  if (!camp || !station) {
    return <EmptyState icon={CalendarX} title="Camp not found" description="It may have ended or been removed. Pick a camp from the list to carry on." action={<Link href="/nurse" className="tap-target text-sm font-medium text-primary">All camps</Link>} />;
  }

  const screened = rows.filter(isScreened);
  const followUps = rows.filter((r) => r.result?.status === "follow-up");
  const absent = rows.filter(isAbsent).length;
  const todo = rows.filter(isToDo).length;

  return (
    <div className="flex flex-col gap-5">
      <CampDayHeader camp={camp} station={station} done={screened.length} total={rows.length} page="summary" />
      <p className="inline-flex items-center gap-2 text-[13px] text-ink-soft">
        <Radio aria-hidden className="size-4 text-success" /> Live — updates as results are saved, including from other tabs
      </p>
      <section aria-label="Station totals" className="rounded-xl border border-line bg-canvas p-5 text-center">
        <p className="tabular text-5xl leading-none font-semibold tracking-tight text-ink">
          {screened.length}
          <span className="text-2xl text-ink-faint"> / {rows.length}</span>
        </p>
        <p className="mt-2 text-sm text-ink-soft">students screened · {SCREENING_TYPE_LABELS[station.type]} station</p>
      </section>
      <KpiBand className="grid-cols-3 md:grid-cols-3 xl:grid-cols-3">
        <KpiTile label="Follow-ups" value={followUps.length} />
        <KpiTile label="Absent" value={absent} />
        <KpiTile label="Still to see" value={todo} />
      </KpiBand>
      <Panel title="All stations" bodyClassName="gap-4">
        {stations.map((st) => (
          <Link key={st.screening.id} href={stationHref(camp.id, "summary", st.screening.id)} className={cn("flex flex-col gap-1.5 rounded-lg p-2 -m-2 transition-colors duration-150 hover:bg-surface", st.screening.id === station.id && "bg-surface")}>
            <span className="flex justify-between text-sm">
              <span className="font-medium text-ink">{SCREENING_TYPE_LABELS[st.screening.type]}</span>
              <span className="tabular text-ink-soft">{st.done}/{st.total}{st.followUps > 0 && ` · ${st.followUps} follow-up`}</span>
            </span>
            <ProgressBar value={st.done} max={st.total} label={`${SCREENING_TYPE_LABELS[st.screening.type]} progress`} />
          </Link>
        ))}
      </Panel>
      <Panel title="Follow-ups at this station" bodyClassName="p-0 gap-0">
        {followUps.length === 0 ? (
          <p className="px-5 py-4 text-sm text-ink-soft">No follow-ups raised here so far. Anyone you flag shows up here with your note.</p>
        ) : (
          <ul className="divide-y divide-line">
            {followUps.map((r) => (
              <li key={r.student.id}>
                <Link href={screenHref(camp.id, r.student.id, station.id)} className="flex flex-col px-5 py-3 transition-colors duration-150 hover:bg-surface">
                  <span className="font-medium text-ink">{r.student.name} <span className="text-[13px] font-normal text-ink-faint">· {r.classKey}</span></span>
                  {r.result?.notes && <span className="text-sm text-ink-soft">{r.result.notes}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
