import { Calendar } from "lucide-react";
import { ArchivedBadge } from "@/components/ui/archive-toggle";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDateRange } from "@/lib/format";
import { CAMP_PHASE, RESULT_STATUS, SCREENING_TYPE_LABELS } from "@/lib/labels";
import { campPhase } from "@/lib/selectors/camps";
import type { StudentScreeningRow } from "@/lib/selectors/students";
import type { Camp } from "@/lib/types/camp";
import { ResultDialog } from "./result-dialog";

type CampHistoryGroupProps = {
  camp: Camp;
  rows: StudentScreeningRow[];
  studentName: string;
};

export function CampHistoryGroup({ camp, rows, studentName }: CampHistoryGroupProps) {
  const phase = campPhase(camp);
  const missedLabel = phase === "upcoming" ? "Scheduled" : phase === "completed" ? "Not screened" : "Not yet screened";
  return (
    <Panel
      as="h3"
      title={camp.name}
      description={
        <span className="inline-flex items-center gap-1.5">
          <Calendar aria-hidden className="size-3.5" />
          {formatDateRange(camp.startDate, camp.endDate)}
        </span>
      }
      actions={<StatusBadge {...CAMP_PHASE[phase]} />}
      bodyClassName="p-0 gap-0"
    >
      <ul className="divide-y divide-line">
        {rows.map(({ screening, result }) => (
          <li key={screening.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-[15px] font-medium text-ink">
                {SCREENING_TYPE_LABELS[screening.type]}
                {result?.archivedYear && <ArchivedBadge year={result.archivedYear} />}
              </p>
              <p className="text-[13px] text-ink-faint">
                {screening.leadDoctor} · {formatDate(screening.date)}
              </p>
              {result?.notes && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{result.notes}</p>}
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              {result ? <StatusBadge {...RESULT_STATUS[result.status]} /> : <StatusBadge tone="neutral" label={missedLabel} />}
              {result && result.status !== "pending" ? (
                <ResultDialog row={{ camp, screening, result }} studentName={studentName} />
              ) : (
                <span className="w-[108px]" aria-hidden />
              )}
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
