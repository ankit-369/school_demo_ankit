"use client";

import { FileText, FolderOpen, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { ArchivedBadge, ArchiveToggle } from "@/components/ui/archive-toggle";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { HfilesSyncBadge } from "@/components/ui/hfiles-sync-badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatBytes, formatDate } from "@/lib/format";
import { REPORT_CATEGORY_LABELS } from "@/lib/labels";
import { useCan } from "@/lib/hooks/use-can";
import { useAppStore } from "@/lib/store/app-store";
import type { Report } from "@/lib/types/report";
import type { Column } from "@/lib/types/table";
import { useCurrentStudent } from "../student-context";
import { UploadReportDialog } from "./upload-report-dialog";

export function ReportsTab() {
  const student = useCurrentStudent();
  const allReports = useAppStore((s) => s.reports);
  const syncReport = useAppStore((s) => s.syncReportToHfiles);
  const canUpload = useCan("uploadReports");
  const [showArchived, setShowArchived] = useState(false);
  const mine = useMemo(
    () => allReports.filter((r) => r.studentId === student.id).sort((a, b) => b.uploadDate.localeCompare(a.uploadDate)),
    [allReports, student.id],
  );
  const archivedCount = mine.filter((r) => r.archivedYear).length;
  const reports = showArchived ? mine : mine.filter((r) => !r.archivedYear);

  const columns: Column<Report>[] = [
    {
      id: "file",
      header: "File",
      cell: (r) => (
        <span className="inline-flex items-center gap-2 font-medium">
          <FileText aria-hidden className="size-4 shrink-0 text-ink-faint" />
          {r.fileName}
          {r.archivedYear && <ArchivedBadge year={r.archivedYear} />}
        </span>
      ),
    },
    { id: "category", header: "Category", cell: (r) => <span className="text-ink-soft">{REPORT_CATEGORY_LABELS[r.category]}</span> },
    { id: "date", header: "Uploaded", cell: (r) => formatDate(r.uploadDate) },
    { id: "size", header: "Size", align: "right", cell: (r) => formatBytes(r.size) },
    { id: "by", header: "Uploaded by", cell: (r) => <span className="text-ink-soft">{r.uploadedBy}</span> },
    {
      id: "sync",
      header: "hfiles.in",
      cell: (r) =>
        r.syncedToHfiles ? (
          <HfilesSyncBadge synced />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-primary"
            disabled={!canUpload}
            onClick={() => {
              syncReport(r.id);
              toast.success("Synced to hfiles.in", { description: r.fileName });
            }}
          >
            <RefreshCw aria-hidden />
            Sync now
          </Button>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading title="Reports" actions={<UploadReportDialog studentId={student.id} studentName={student.name} />} />
      <ArchiveToggle count={archivedCount} shown={showArchived} onToggle={() => setShowArchived((v) => !v)} className="self-start" />
      <DataTable
        caption={`Reports for ${student.name}`}
        columns={columns}
        rows={reports}
        getRowId={(r) => r.id}
        empty={<EmptyState icon={FolderOpen} title="No reports yet" description="Uploaded reports are saved here and synced to hfiles.in." />}
      />
    </div>
  );
}
