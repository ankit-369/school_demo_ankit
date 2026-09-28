"use client";

import Link from "next/link";
import { BellRing, PartyPopper } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { GatedButton } from "@/components/ui/gated-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, pluralize } from "@/lib/format";
import { useCan } from "@/lib/hooks/use-can";
import { pendingItems, type PendingItem } from "@/lib/selectors/insights-reports";
import { useAppStore } from "@/lib/store/app-store";
import { classKey, type Grade } from "@/lib/types/grade";
import type { Column } from "@/lib/types/table";
import { PendingRowAction } from "./pending-row-action";
import { reminderMessage } from "@/lib/notifications/reminder-message";

export function PendingView({ grade }: { grade: Grade | null }) {
  const students = useAppStore((s) => s.students);
  const camps = useAppStore((s) => s.camps);
  const reports = useAppStore((s) => s.reports);
  const notifications = useAppStore((s) => s.notifications);
  const send = useAppStore((s) => s.sendNotification);
  const template = useAppStore((s) => s.templates.pendingReportReminder);
  const schoolName = useAppStore((s) => s.school.name);
  const canNotify = useCan("notifyGuardians");
  const canSync = useCan("uploadReports");
  const items = useMemo(() => pendingItems({ students, camps, reports }, notifications, grade), [students, camps, reports, notifications, grade]);
  const unreminded = items.filter((i) => i.kind === "screening" && !i.remindedAt);

  function remindAll() {
    unreminded.forEach((i) => send({ studentId: i.student.id, type: "report-reminder", channel: "whatsapp", message: reminderMessage(i, template, schoolName), refId: i.id }));
    toast.success(`Sent ${pluralize(unreminded.length, "reminder")}`, { description: "Guardians notified on WhatsApp" });
  }

  const columns: Column<PendingItem>[] = [
    {
      id: "student",
      header: "Student",
      cell: ({ student: s }) => (
        <span className="flex flex-col">
          <Link href={`/admin/students/${s.id}`} className="w-fit rounded-sm font-medium text-ink hover:text-primary hover:underline">{s.name}</Link>
          <span className="text-[13px] text-ink-faint">{classKey(s.grade, s.division)}</span>
        </span>
      ),
    },
    {
      id: "what",
      header: "Outstanding",
      className: "whitespace-normal",
      cell: (i) => (
        <span className="flex flex-col">
          <span className="font-medium text-ink">{i.title}</span>
          <span className="text-[13px] text-ink-faint">{i.detail}</span>
        </span>
      ),
    },
    {
      id: "kind",
      header: "Type",
      cell: (i) => (i.kind === "screening" ? <StatusBadge tone="warning" label="Result pending" /> : <StatusBadge tone="neutral" label="Not synced" />),
    },
    { id: "since", header: "Since", cell: (i) => <span className="text-ink-soft">{formatDate(i.since)}</span> },
    { id: "action", header: <span className="sr-only">Action</span>, align: "right", cell: (i) => <PendingRowAction item={i} canNotify={canNotify} canSync={canSync} /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft" aria-live="polite">
          {pluralize(items.length, "item")} outstanding · {pluralize(unreminded.length, "guardian")} not yet reminded
        </p>
        <GatedButton allowed={canNotify} icon={BellRing} lockedReason="Your role can't message guardians" disabled={unreminded.length === 0} onClick={remindAll}>
          Remind all ({unreminded.length})
        </GatedButton>
      </div>
      <DataTable
        caption="Pending reports"
        columns={columns}
        rows={items}
        getRowId={(i) => i.id}
        empty={<EmptyState icon={PartyPopper} title="Nothing outstanding" description="Every result is recorded and every upload is on hfiles.in." />}
      />
    </div>
  );
}
