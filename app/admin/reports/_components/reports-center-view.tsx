"use client";

import Link from "next/link";
import { FileText, FolderOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { ArchivedBadge } from "@/components/ui/archive-toggle";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { HfilesSyncBadge } from "@/components/ui/hfiles-sync-badge";
import { PageHeader } from "@/components/ui/page-header";
import { formatBytes, formatDate } from "@/lib/format";
import { REPORT_CATEGORY_LABELS } from "@/lib/labels";
import { allReportRows, EMPTY_REPORTS_FILTER, type ReportRow } from "@/lib/selectors/reports";
import { useAppStore } from "@/lib/store/app-store";
import { classKey } from "@/lib/types/grade";
import type { Column } from "@/lib/types/table";
import { ReportsFilters } from "./reports-filters";

const columns: Column<ReportRow>[] = [
  {
    id: "file",
    header: "File",
    cell: ({ report: r }) => (
      <span className="inline-flex items-center gap-2 font-medium">
        <FileText aria-hidden className="size-4 shrink-0 text-ink-faint" />
        {r.fileName}
        {r.archivedYear && <ArchivedBadge year={r.archivedYear} />}
      </span>
    ),
  },
  {
    id: "student",
    header: "Student",
    cell: ({ student: s }) => (
      <span className="flex flex-col">
        <Link href={`/admin/students/${s.id}/reports`} className="w-fit rounded-sm font-medium text-ink hover:text-primary hover:underline">{s.name}</Link>
        <span className="text-[13px] text-ink-faint">{classKey(s.grade, s.division)}</span>
      </span>
    ),
  },
  { id: "category", header: "Category", cell: ({ report: r }) => <span className="text-ink-soft">{REPORT_CATEGORY_LABELS[r.category]}</span> },
  { id: "date", header: "Uploaded", cell: ({ report: r }) => formatDate(r.uploadDate) },
  { id: "size", header: "Size", align: "right", cell: ({ report: r }) => formatBytes(r.size) },
  { id: "by", header: "Uploaded by", cell: ({ report: r }) => <span className="text-ink-soft">{r.uploadedBy}</span> },
  { id: "sync", header: "hfiles.in", cell: ({ report: r }) => <HfilesSyncBadge synced={r.syncedToHfiles} /> },
];

export function ReportsCenterView() {
  const reports = useAppStore((s) => s.reports);
  const students = useAppStore((s) => s.students);
  const [filter, setFilter] = useState(EMPTY_REPORTS_FILTER);
  const archivedCount = useMemo(() => reports.filter((r) => r.archivedYear).length, [reports]);
  const rows = useMemo(() => allReportRows(reports, students, filter), [reports, students, filter]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reports" description={`${reports.length} documents uploaded across every student.`} />
      <ReportsFilters value={filter} onChange={setFilter} archivedCount={archivedCount} />
      <p className="text-sm text-ink-soft" aria-live="polite">Showing {rows.length} {JSON.stringify(filter) === JSON.stringify(EMPTY_REPORTS_FILTER) ? "" : `of ${reports.length} `}reports</p>
      <DataTable
        caption="All reports"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.report.id}
        scrollClassName="max-h-[calc(100dvh-340px)] min-h-72"
        empty={<EmptyState icon={FolderOpen} title="No reports match" description="Try clearing a filter." />}
      />
    </div>
  );
}
