"use client";

import Link from "next/link";
import { CalendarX, ChevronRight, Lock } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { ROLE_STAFF_IDS } from "@/lib/data/personas";
import { formatDateRange, localDateString } from "@/lib/format";
import { useCan } from "@/lib/hooks/use-can";
import { campStudentsDone, stationHref } from "@/lib/selectors/camp-day";
import { campPhase } from "@/lib/selectors/camps";
import { useAppStore } from "@/lib/store/app-store";

/** Camps a nurse can run today, ongoing ones first. */
export function NurseHome() {
  const camps = useAppStore((s) => s.camps);
  const students = useAppStore((s) => s.students);
  const staffName = useAppStore((s) => s.staff.find((st) => st.id === ROLE_STAFF_IDS.nurse)?.name ?? "Nurse");
  const can = useCan("recordResults");
  const today = localDateString();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const list = useMemo(
    () => camps.filter((c) => campPhase(c) !== "completed").sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [camps],
  );

  if (!can) {
    return <EmptyState icon={Lock} title="Camp-day mode is for clinical staff" description="Your role can't record screening results." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{greeting}, {staffName.replace(/^Nurse\s+/, "")}</h1>
        <p className="mt-1 text-[15px] text-ink-soft">Pick a camp to open today&apos;s roster.</p>
      </header>
      {list.length === 0 ? (
        <EmptyState icon={CalendarX} title="No camps running" description="Upcoming and ongoing camps appear here." />
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((c) => {
            const { done, total } = campStudentsDone(c, students);
            const isToday = c.startDate <= today && today <= c.endDate;
            return (
              <li key={c.id}>
                <Link href={stationHref(c.id, "roster")} className="flex items-center gap-4 rounded-xl border border-line bg-canvas p-4 transition-colors duration-150 hover:bg-surface">
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[17px] font-semibold text-ink">{c.name}</span>
                      {isToday ? <StatusBadge tone="warning" label="Running today" /> : <StatusBadge tone="neutral" label="Upcoming" />}
                    </div>
                    <span className="text-[13px] text-ink-faint">{formatDateRange(c.startDate, c.endDate)} · {c.screenings.length} stations</span>
                    <div className="flex items-center gap-3">
                      <ProgressBar value={done} max={total} label={`${c.name} progress`} />
                      <span className="tabular shrink-0 text-[13px] text-ink-soft">{done}/{total}</span>
                    </div>
                  </div>
                  <ChevronRight aria-hidden className="size-5 shrink-0 text-ink-faint" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
