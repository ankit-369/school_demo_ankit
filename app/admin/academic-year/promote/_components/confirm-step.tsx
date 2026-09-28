"use client";

import { Archive } from "lucide-react";
import { useMemo } from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";
import { archivesEntries, outcomeFor, planCounts, yearLabel, type PromotionPlan } from "@/lib/academic/promotion-plan";
import { pluralize } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";

type ConfirmStepProps = { plan: PromotionPlan; fromYear: string; toYear: string; reason: string; onReason: (r: string) => void; reasonError?: string };

/** Step 4 — the exact outcome, computed with the same functions the store runs. */
export function ConfirmStep({ plan, fromYear, toYear, reason, onReason, reasonError }: ConfirmStepProps) {
  const students = useAppStore((s) => s.students);
  const camps = useAppStore((s) => s.camps);
  const notes = useAppStore((s) => s.notes);
  const reports = useAppStore((s) => s.reports);
  const counts = planCounts(students, plan);

  const archive = useMemo(() => {
    const ids = new Set(students.filter((s) => s.status === "active" && archivesEntries(outcomeFor(s, plan).outcome)).map((s) => s.id));
    const live = <T extends { studentId: string; archivedYear?: string }>(xs: T[]) => xs.filter((x) => ids.has(x.studentId) && !x.archivedYear).length;
    return { results: live(camps.flatMap((c) => c.screenings.flatMap((s) => s.results))), notes: live(notes), reports: live(reports) };
  }, [students, camps, notes, reports, plan]);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[15px] text-ink-soft">
        This closes <span className="font-medium text-ink">{yearLabel(fromYear)}</span> and starts <span className="font-medium text-ink">{yearLabel(toYear)}</span>. Review the numbers, then confirm.
      </p>
      <KpiBand className="grid-cols-2 md:grid-cols-5 xl:grid-cols-5">
        <KpiTile label="Promoted" value={counts.promoted} />
        <KpiTile label="Graduating" value={counts.graduated} />
        <KpiTile label="Retained" value={counts.retained} />
        <KpiTile label="Transferred" value={counts.transferred} />
        <KpiTile label="Exited" value={counts.exited} />
      </KpiBand>
      <div className="flex gap-3 rounded-lg bg-surface px-4 py-3">
        <Archive aria-hidden className="mt-0.5 size-5 shrink-0 text-ink-faint" />
        <div className="text-sm text-ink-soft">
          <p className="font-medium text-ink">Archived for promoted and graduating students</p>
          <p>
            {pluralize(archive.results, "screening result")}, {pluralize(archive.notes, "clinical note")} and {pluralize(archive.reports, "report")} will be tagged {yearLabel(fromYear)}.
            Nothing is deleted — profiles show the new year by default, with previous years one tap away. Allergies, conditions and hfiles.in data stay current.
          </p>
        </div>
      </div>
      <FormField label="Reason" htmlFor="promo-reason" error={reasonError} hint="Recorded in the audit log.">
        <Input id="promo-reason" value={reason} onChange={(e) => onReason(e.target.value)} placeholder={`e.g. Annual promotion ${yearLabel(fromYear)} → ${yearLabel(toYear)}`} aria-invalid={reasonError ? true : undefined} aria-describedby={reasonError ? "promo-reason-error" : undefined} />
      </FormField>
    </div>
  );
}
