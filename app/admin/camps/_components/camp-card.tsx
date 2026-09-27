import Link from "next/link";
import { Calendar, Stethoscope, Users } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateRange, pluralize } from "@/lib/format";
import { CAMP_PHASE } from "@/lib/labels";
import { campDoctors, campPhase, campProgress, campStandards, standardsLabel } from "@/lib/selectors/camps";
import type { Camp } from "@/lib/types/camp";
import type { Student } from "@/lib/types/student";

export function CampCard({ camp, students }: { camp: Camp; students: Student[] }) {
  const { done, expected } = campProgress(camp, students);
  const doctors = campDoctors(camp);

  return (
    <Link
      href={`/admin/camps/${camp.id}`}
      className="flex flex-col gap-4 rounded-xl border border-line bg-canvas p-5 transition-colors duration-150 hover:bg-surface"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[17px] leading-6 font-semibold text-ink">{camp.name}</h3>
          <p className="mt-0.5 inline-flex items-center gap-1.5 text-[13px] text-ink-faint">
            <Calendar aria-hidden className="size-3.5" />
            {formatDateRange(camp.startDate, camp.endDate)}
          </p>
        </div>
        <StatusBadge {...CAMP_PHASE[campPhase(camp)]} />
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-ink-soft">
          <Stethoscope aria-hidden className="size-4 text-ink-faint" />
          <dt className="sr-only">Screenings</dt>
          <dd>{pluralize(camp.screenings.length, "screening")}</dd>
        </div>
        <div className="flex items-center gap-2 text-ink-soft">
          <Users aria-hidden className="size-4 text-ink-faint" />
          <dt className="sr-only">Classes</dt>
          <dd>Classes {standardsLabel(campStandards(camp))}</dd>
        </div>
        <div className="col-span-2 truncate text-ink-soft">
          <dt className="sr-only">Lead doctors</dt>
          <dd className="truncate">{doctors.join(", ")}</dd>
        </div>
      </dl>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[13px]">
          <span className="text-ink-soft">Screenings done</span>
          <span className="tabular font-medium text-ink">
            {done} <span className="text-ink-faint">/ {expected}</span>
          </span>
        </div>
        <ProgressBar value={done} max={expected} label={`${camp.name} progress`} />
      </div>
    </Link>
  );
}
