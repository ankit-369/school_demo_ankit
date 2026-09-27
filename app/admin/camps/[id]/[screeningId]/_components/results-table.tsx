"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { HfilesSyncBadge } from "@/components/ui/hfiles-sync-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { useCan } from "@/lib/hooks/use-can";
import { RESULT_STATUS } from "@/lib/labels";
import type { ResultRow } from "@/lib/selectors/screening-results";
import type { Column } from "@/lib/types/table";
import { RecordResultDialog } from "./record-result-dialog";

type ResultsTableProps = { campId: string; screeningId: string; rows: ResultRow[] };

export function ResultsTable({ campId, screeningId, rows }: ResultsTableProps) {
  const canRecord = useCan("recordResults");

  const columns: Column<ResultRow>[] = [
    {
      id: "student",
      header: "Student",
      cell: ({ student: s }) => (
        <div className="flex items-center gap-3">
          <StudentAvatar name={s.name} photoUrl={s.photoUrl} />
          <div className="flex flex-col">
            <Link href={`/admin/students/${s.id}/camp-history`} className="w-fit rounded-sm font-medium text-ink hover:text-primary hover:underline">
              {s.name}
            </Link>
            <span className="text-[13px] text-ink-faint">{s.hfid}</span>
          </div>
        </div>
      ),
    },
    { id: "class", header: "Class", cell: (r) => r.classKey },
    { id: "roll", header: "Roll no.", align: "right", cell: (r) => r.student.rollNumber },
    {
      id: "result",
      header: "Result",
      cell: ({ result }) => (result ? <StatusBadge {...RESULT_STATUS[result.status]} /> : <StatusBadge tone="neutral" label="Not screened" />),
    },
    {
      id: "notes",
      header: "Findings",
      className: "max-w-72 whitespace-normal",
      cell: ({ result }) => <span className="line-clamp-2 text-sm text-ink-soft">{result?.notes || "—"}</span>,
    },
    {
      id: "hfiles",
      header: "hfiles.in",
      cell: (r) => <HfilesSyncBadge synced={r.sentToHfiles} syncedLabel="Sent" unsyncedLabel="Not sent" />,
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      cell: (r) => <RecordResultDialog campId={campId} screeningId={screeningId} student={r.student} result={r.result} disabled={!canRecord} />,
    },
  ];

  return (
    <DataTable
      caption="Screening results"
      columns={columns}
      rows={rows}
      getRowId={(r) => r.student.id}
      scrollClassName="max-h-[calc(100dvh-240px)] min-h-72"
      empty={<EmptyState icon={Users} title="No students in this class" description="Pick another class tab." />}
    />
  );
}
