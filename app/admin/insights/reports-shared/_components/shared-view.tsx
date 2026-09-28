"use client";

import Link from "next/link";
import { FileText, Inbox, Stethoscope } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup } from "@/components/ui/chip-group";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { HfilesSyncBadge } from "@/components/ui/hfiles-sync-badge";
import { formatDateTime, formatRelative } from "@/lib/format";
import { sharedItems, type SharedItem } from "@/lib/selectors/insights-reports";
import { useAppStore } from "@/lib/store/app-store";
import { classKey, type Grade } from "@/lib/types/grade";
import type { Column } from "@/lib/types/table";

type Kind = "all" | SharedItem["kind"];

const columns: Column<SharedItem>[] = [
  {
    id: "when",
    header: "Shared",
    cell: (i) => (
      <time dateTime={i.sharedAt} title={formatDateTime(i.sharedAt)} className="flex flex-col">
        <span className="text-ink">{formatRelative(i.sharedAt)}</span>
        <span className="text-[13px] text-ink-faint">{formatDateTime(i.sharedAt)}</span>
      </time>
    ),
  },
  {
    id: "student",
    header: "Student",
    mobile: "title",
    cell: ({ student: s }) => (
      <span className="flex flex-col">
        <Link href={`/admin/students/${s.id}/reports`} className="w-fit rounded-sm font-medium text-ink hover:text-primary hover:underline">{s.name}</Link>
        <span className="text-[13px] text-ink-faint">{classKey(s.grade, s.division)}</span>
      </span>
    ),
  },
  {
    id: "what",
    header: "What was shared",
    className: "whitespace-normal",
    cell: (i) => {
      const Icon = i.kind === "upload" ? FileText : Stethoscope;
      return (
        <span className="flex items-start gap-2">
          <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-faint" />
          <span className="flex flex-col">
            <span className="font-medium text-ink">{i.title}</span>
            <span className="text-[13px] text-ink-faint">{i.detail}</span>
          </span>
        </span>
      );
    },
  },
  { id: "channel", header: "Delivered via", cell: () => <HfilesSyncBadge synced syncedLabel="hfiles.in" /> },
];

export function SharedView({ grade }: { grade: Grade | null }) {
  const students = useAppStore((s) => s.students);
  const camps = useAppStore((s) => s.camps);
  const reports = useAppStore((s) => s.reports);
  const [kind, setKind] = useState<Kind>("all");
  const items = useMemo(() => sharedItems({ students, camps, reports }, grade), [students, camps, reports, grade]);
  const rows = kind === "all" ? items : items.filter((i) => i.kind === kind);
  const count = (k: SharedItem["kind"]) => items.filter((i) => i.kind === k).length;

  return (
    <div className="flex flex-col gap-4">
      <ChipGroup
        label="Filter by type"
        value={kind}
        onChange={setKind}
        chips={[
          { value: "all", label: `All (${items.length})` },
          { value: "upload", label: `Uploaded reports (${count("upload")})` },
          { value: "screening", label: `Screening results (${count("screening")})` },
        ]}
      />
      <DataTable
        caption="Reports shared with families"
        columns={columns}
        rows={rows}
        getRowId={(i) => i.id}
        empty={
          <EmptyState
            icon={Inbox}
            title="Nothing shared yet"
            description="Uploading a report, or sending screening results to hfiles.in from a camp, shares it with the family."
          />
        }
      />
    </div>
  );
}
