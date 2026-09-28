"use client";

import Link from "next/link";
import { ClipboardX } from "lucide-react";
import { useMemo } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";
import { TabNav } from "@/components/ui/tab-nav";
import { formatDate } from "@/lib/format";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { standardsLabel } from "@/lib/selectors/camps";
import { isScreened, rowClasses, screeningRows } from "@/lib/selectors/screening-results";
import { useAppStore } from "@/lib/store/app-store";
import { GRADES } from "@/lib/types/grade";
import { DoctorLinkDialog } from "./doctor-link-dialog";
import { ExportCsvButton } from "./export-csv-button";
import { ResultsTable } from "./results-table";
import { SendToHfilesDialog } from "./send-to-hfiles-dialog";

type ScreeningResultsProps = { campId: string; screeningId: string; classFilter?: string };

export function ScreeningResults({ campId, screeningId, classFilter }: ScreeningResultsProps) {
  const camp = useAppStore((s) => s.camps.find((c) => c.id === campId));
  const screening = camp?.screenings.find((s) => s.id === screeningId);
  const students = useAppStore((s) => s.students);
  const allRows = useMemo(() => (screening ? screeningRows(screening, students) : []), [screening, students]);
  const classes = rowClasses(allRows);
  const active = classFilter && (classes as string[]).includes(classFilter) ? classFilter : undefined;
  const rows = active ? allRows.filter((r) => r.classKey === active) : allRows;

  if (!camp || !screening) {
    return (
      <EmptyState
        icon={ClipboardX}
        title="Screening not found"
        description="It may have been removed, or the demo data was reset."
        action={<Button asChild variant="outline"><Link href={camp ? `/admin/camps/${camp.id}` : "/admin/camps"}>Back</Link></Button>}
      />
    );
  }

  const base = `/admin/camps/${camp.id}/${screening.id}`;
  const title = SCREENING_TYPE_LABELS[screening.type];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Health camps", href: "/admin/camps" }, { label: camp.name, href: `/admin/camps/${camp.id}` }, { label: title }]} />
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{title} results</h1>
          <p className="mt-1 text-[15px] text-ink-soft">
            Classes {standardsLabel(GRADES.filter((g) => screening.targetStandards.includes(g)))} · {screening.leadDoctor} · {formatDate(screening.date)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DoctorLinkDialog camp={camp} screening={screening} />
          <ExportCsvButton camp={camp} screening={screening} rows={rows} scope={active ?? "all-classes"} />
          <SendToHfilesDialog camp={camp} screening={screening} rows={rows} />
        </div>
      </header>
      <KpiBand className="md:grid-cols-4 xl:grid-cols-4">
        <KpiTile label="Screened" value={rows.filter(isScreened).length} hint={`of ${rows.length} students`} />
        <KpiTile label="Follow-ups" value={rows.filter((r) => r.result?.status === "follow-up").length} />
        <KpiTile label="Not yet screened" value={rows.filter((r) => !isScreened(r)).length} />
        <KpiTile label="Sent to hfiles.in" value={rows.filter((r) => r.sentToHfiles).length} />
      </KpiBand>
      <TabNav
        label="Filter by class"
        activeHref={active ? `${base}?class=${active}` : base}
        items={[{ href: base, label: "All classes" }, ...classes.map((c) => ({ href: `${base}?class=${c}`, label: c }))]}
      />
      <ResultsTable campId={camp.id} screeningId={screening.id} rows={rows} />
    </div>
  );
}
