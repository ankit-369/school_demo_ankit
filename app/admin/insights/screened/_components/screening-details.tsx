import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { RESULT_STATUS, SCREENING_TYPE_LABELS } from "@/lib/labels";
import type { ScreenedScreening } from "@/lib/selectors/insights-screened";
import { classKey } from "@/lib/types/grade";

/** One screening as a native disclosure: summary line, expands to the students screened. */
export function ScreeningDetails({ item, campId }: { item: ScreenedScreening; campId: string }) {
  const { screening, rows } = item;
  const followUps = rows.filter((r) => r.result.status === "follow-up").length;

  return (
    <details className="group rounded-lg border border-line [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 transition-colors duration-150 hover:bg-surface">
        <ChevronDown aria-hidden className="size-4 shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-180" />
        <span className="font-medium text-ink">{SCREENING_TYPE_LABELS[screening.type]}</span>
        <span className="text-[13px] text-ink-faint">{screening.leadDoctor}</span>
        <span className="ml-auto flex items-center gap-2">
          <span className="tabular text-sm text-ink-soft">{rows.length} screened</span>
          {followUps > 0 && <StatusBadge tone="warning" label={`${followUps} follow-up${followUps > 1 ? "s" : ""}`} />}
        </span>
      </summary>
      <div className="border-t border-line">
        <ul className="divide-y divide-line">
          {rows.map(({ student: s, result }) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 pl-11">
              <span className="min-w-0">
                <Link href={`/admin/students/${s.id}/camp-history`} className="rounded-sm text-[15px] text-ink hover:text-primary hover:underline">
                  {s.name}
                </Link>
                <span className="text-[13px] text-ink-faint"> · {classKey(s.grade, s.division)}</span>
              </span>
              <StatusBadge {...RESULT_STATUS[result.status]} />
            </li>
          ))}
        </ul>
        <Link href={`/admin/camps/${campId}/${screening.id}`} className="block border-t border-line px-4 py-2.5 pl-11 text-sm font-medium text-primary hover:underline">
          Open full results
        </Link>
      </div>
    </details>
  );
}
