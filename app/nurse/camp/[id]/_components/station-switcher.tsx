import Link from "next/link";
import { formatShortDate, localDateString } from "@/lib/format";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { stationHref } from "@/lib/selectors/camp-day";
import type { Camp } from "@/lib/types/camp";
import type { Screening } from "@/lib/types/screening";
import { cn } from "@/lib/utils";

/** One chip per screening in the camp; today's are labelled so the nurse picks the right one. */
export function StationSwitcher({ camp, active, page }: { camp: Camp; active: Screening; page: "roster" | "summary" }) {
  if (camp.screenings.length < 2) return null;
  const today = localDateString();
  return (
    <nav aria-label="Stations" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
      {camp.screenings.map((s) => {
        const on = s.id === active.id;
        return (
          <Link
            key={s.id}
            href={stationHref(camp.id, page, s.id)}
            aria-current={on ? "page" : undefined}
            className={cn(
              "flex h-11 shrink-0 flex-col items-start justify-center rounded-lg border px-3 text-left transition-colors duration-150",
              on ? "border-primary bg-primary text-white" : "border-line bg-canvas text-ink-soft hover:text-ink",
            )}
          >
            <span className="text-[13px] leading-4 font-semibold whitespace-nowrap">{SCREENING_TYPE_LABELS[s.type].replace(" screening", "")}</span>
            <span className={cn("text-[11px] leading-4", on ? "text-white/80" : "text-ink-faint")}>{s.date === today ? "Today" : formatShortDate(s.date)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
