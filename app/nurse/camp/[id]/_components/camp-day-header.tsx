import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { stationHref } from "@/lib/selectors/camp-day";
import type { Camp } from "@/lib/types/camp";
import type { Screening } from "@/lib/types/screening";
import { cn } from "@/lib/utils";
import { StationSwitcher } from "./station-switcher";

type CampDayHeaderProps = {
  camp: Camp;
  station: Screening;
  done: number;
  total: number;
  page: "roster" | "summary";
};

/** Camp name, the station being run, its progress, and Roster/Summary tabs. */
export function CampDayHeader({ camp, station, done, total, page }: CampDayHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <Link href="/nurse" className="inline-flex w-fit items-center gap-1 rounded-sm text-sm font-medium text-ink-soft hover:text-ink">
        <ChevronLeft aria-hidden className="size-4" />
        All camps
      </Link>
      <div>
        <h1 className="text-xl leading-7 font-semibold tracking-tight text-ink">{camp.name}</h1>
        <p className="text-sm text-ink-soft">
          {SCREENING_TYPE_LABELS[station.type]} station · {station.leadDoctor}
        </p>
      </div>
      <StationSwitcher camp={camp} active={station} page={page} />
      <div className="flex items-center gap-3">
        <ProgressBar value={done} max={total} label={`${SCREENING_TYPE_LABELS[station.type]} progress`} className="h-2" />
        <span className="tabular shrink-0 text-sm font-medium text-ink">
          {done}/{total}
        </span>
      </div>
      <nav aria-label="Camp-day sections" className="grid grid-cols-2 rounded-lg bg-canvas p-1 ring-1 ring-line">
        {(["roster", "summary"] as const).map((p) => (
          <Link
            key={p}
            href={stationHref(camp.id, p, station.id)}
            aria-current={page === p ? "page" : undefined}
            className={cn(
              "flex h-10 items-center justify-center rounded-md text-sm font-medium capitalize transition-colors duration-150 pointer-coarse:h-11",
              page === p ? "bg-primary text-white" : "text-ink-soft hover:text-ink",
            )}
          >
            {p}
          </Link>
        ))}
      </nav>
    </header>
  );
}
