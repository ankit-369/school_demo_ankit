import Link from "next/link";
import { ArrowUpCircle, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { yearLabel } from "@/lib/academic/promotion-plan";

export function AcademicYearCard({ year }: { year: string }) {
  return (
    <Panel title="Academic year" description="The current school year, shown across the app.">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-surface px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-canvas ring-1 ring-line">
            <CalendarClock aria-hidden className="size-5 text-ink-soft" />
          </span>
          <div>
            <p className="text-2xl leading-8 font-semibold tracking-tight text-ink">{yearLabel(year)}</p>
            <p className="text-[13px] text-ink-faint">Current year</p>
          </div>
        </div>
        <Button asChild variant="outline" className="border-line">
          <Link href="/admin/academic-year/promote">
            <ArrowUpCircle aria-hidden />
            Promote to next year
          </Link>
        </Button>
      </div>
    </Panel>
  );
}
