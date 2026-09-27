import Link from "next/link";
import { ChevronRight, ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { screeningTargets, standardsLabel } from "@/lib/selectors/camps";
import type { Camp } from "@/lib/types/camp";
import { GRADES } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";

export function ScreeningsList({ camp, students }: { camp: Camp; students: Student[] }) {
  const screenings = [...camp.screenings].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Panel title="Screenings" description="Open a screening to see results by class, export them, or send them to hfiles.in." bodyClassName="p-0 gap-0">
      {screenings.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No screenings yet" description="Add a screening to start recording results." />
      ) : (
        <ul className="divide-y divide-line">
          {screenings.map((s) => {
            const done = s.results.filter((r) => r.status !== "pending").length;
            const expected = Math.max(s.results.length, screeningTargets(s, students).length);
            const followUps = s.results.filter((r) => r.status === "follow-up").length;
            const standards = GRADES.filter((g) => s.targetStandards.includes(g));
            return (
              <li key={s.id}>
                <Link href={`/admin/camps/${camp.id}/${s.id}`} className="flex flex-col gap-3 px-5 py-4 transition-colors duration-150 hover:bg-surface sm:flex-row sm:items-center sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-ink">{SCREENING_TYPE_LABELS[s.type]}</p>
                    <p className="text-[13px] text-ink-faint">
                      {s.leadDoctor} · {formatDate(s.date)} · Classes {standardsLabel(standards)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:w-72">
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="tabular text-right text-[13px] text-ink-soft">
                        {done} / {expected} screened
                      </span>
                      <ProgressBar value={done} max={expected} label={`${SCREENING_TYPE_LABELS[s.type]} progress`} />
                    </div>
                    {followUps > 0 && <StatusBadge tone="warning" label={`${followUps} follow-up${followUps > 1 ? "s" : ""}`} />}
                    <ChevronRight aria-hidden className="size-4 shrink-0 text-ink-faint" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
