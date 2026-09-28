"use client";

import Link from "next/link";
import { ArrowRight, CalendarX, PartyPopper, Search } from "lucide-react";
import { useState } from "react";
import { ChipGroup } from "@/components/ui/chip-group";
import { EmptyState } from "@/components/ui/empty-state";
import { isToDo, nextToScreen, screenHref, stationHref } from "@/lib/selectors/camp-day";
import { isScreened } from "@/lib/selectors/screening-results";
import { CampDayHeader } from "./camp-day-header";
import { RosterRow } from "./roster-row";
import { useCampDay } from "./use-camp-day";

type View = "todo" | "done" | "all";

export function RosterView({ campId, stationId }: { campId: string; stationId?: string }) {
  const { camp, station, rows } = useCampDay(campId, stationId);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("todo");

  if (!camp || !station) {
    return <EmptyState icon={CalendarX} title="Camp not found" description="Go back and pick a camp." action={<Link href="/nurse" className="text-sm font-medium text-primary">All camps</Link>} />;
  }

  const done = rows.filter((r) => !isToDo(r));
  const todo = rows.filter(isToDo);
  const q = query.trim().toLowerCase();
  const base = view === "todo" ? todo : view === "done" ? done : rows;
  const shown = q ? base.filter((r) => [r.student.name, r.student.hfid, r.classKey].some((v) => v.toLowerCase().includes(q))) : base;
  const next = nextToScreen(rows);
  const screened = rows.filter(isScreened).length;

  return (
    <div className="flex flex-col gap-4">
      <CampDayHeader camp={camp} station={station} done={screened} total={rows.length} page="roster" />
      <div className="relative">
        <label htmlFor="roster-search" className="sr-only">Find a student</label>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-faint" />
        <input
          id="roster-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, class or HFID"
          className="h-12 w-full rounded-xl border border-input bg-canvas pr-4 pl-12 text-[16px] text-ink outline-none placeholder:text-ink-faint focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
      </div>
      <ChipGroup
        label="Show"
        value={view}
        onChange={setView}
        chips={[
          { value: "todo", label: `To do (${todo.length})` },
          { value: "done", label: `Done (${done.length})` },
          { value: "all", label: `All (${rows.length})` },
        ]}
      />
      {shown.length === 0 ? (
        view === "todo" && !q ? (
          <EmptyState icon={PartyPopper} title="Station complete" description="Everyone on this roster has been screened." action={<Link href={stationHref(camp.id, "summary", station.id)} className="text-sm font-medium text-primary">See the summary</Link>} />
        ) : (
          <EmptyState icon={Search} title="No one matches" description="Try another name or class." />
        )
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-canvas">
          {shown.map((r) => (
            <RosterRow key={r.student.id} row={r} href={screenHref(camp.id, r.student.id, station.id)} />
          ))}
        </ul>
      )}
      {next && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-canvas/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur">
          <Link
            href={screenHref(camp.id, next.student.id, station.id)}
            className="mx-auto flex h-14 max-w-2xl items-center justify-center gap-2 rounded-xl bg-primary text-[16px] font-semibold text-white transition-colors duration-150 hover:bg-primary/90"
          >
            Screen next: {next.student.name}
            <ArrowRight aria-hidden className="size-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
