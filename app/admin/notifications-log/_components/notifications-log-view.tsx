"use client";

import Link from "next/link";
import { BellOff } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime, formatRelative } from "@/lib/format";
import { CHANNEL_LABELS, NOTIFICATION_TYPE_LABELS, NOTIFICATION_STATUS } from "@/lib/labels";
import { EMPTY_NOTIFICATIONS_FILTER, notificationRows, type NotificationRow } from "@/lib/selectors/notifications-log";
import { useAppStore } from "@/lib/store/app-store";
import { classKey } from "@/lib/types/grade";
import type { Column } from "@/lib/types/table";
import { NotificationsFilters } from "./notifications-filters";

const columns: Column<NotificationRow>[] = [
  {
    id: "when",
    header: "Sent",
    cell: ({ notification: n }) => (
      <time dateTime={n.createdAt} title={formatDateTime(n.createdAt)} className="flex flex-col">
        <span className="text-ink">{formatRelative(n.createdAt)}</span>
        <span className="text-[13px] text-ink-faint">{formatDateTime(n.createdAt)}</span>
      </time>
    ),
  },
  {
    id: "student",
    header: "Student",
    cell: ({ student: s }) => (
      <span className="flex flex-col">
        <Link href={`/admin/students/${s.id}`} className="w-fit rounded-sm font-medium text-ink hover:text-primary hover:underline">{s.name}</Link>
        <span className="text-[13px] text-ink-faint">{classKey(s.grade, s.division)} · {s.hfid}</span>
      </span>
    ),
  },
  { id: "type", header: "Type", cell: ({ notification: n }) => <span className="text-ink-soft">{NOTIFICATION_TYPE_LABELS[n.type]}</span> },
  {
    id: "message",
    header: "Message",
    className: "max-w-96 whitespace-normal",
    cell: ({ notification: n }) => <span className="line-clamp-2 text-sm text-ink-soft">{n.message}</span>,
  },
  { id: "channel", header: "Channel", cell: ({ notification: n }) => CHANNEL_LABELS[n.channel] },
  { id: "status", header: "Status", cell: ({ notification: n }) => <StatusBadge {...NOTIFICATION_STATUS[n.status]} /> },
];

export function NotificationsLogView() {
  const notifications = useAppStore((s) => s.notifications);
  const students = useAppStore((s) => s.students);
  const [filter, setFilter] = useState(EMPTY_NOTIFICATIONS_FILTER);
  const rows = useMemo(() => notificationRows(notifications, students, filter), [notifications, students, filter]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Notifications log" description={`${notifications.length} messages sent to guardians since the school started using HealthConnect.`} />
      <NotificationsFilters value={filter} onChange={setFilter} />
      <p className="text-sm text-ink-soft" aria-live="polite">Showing {rows.length} of {notifications.length} notifications</p>
      <DataTable
        caption="Notifications sent to guardians"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.notification.id}
        scrollClassName="max-h-[calc(100dvh-320px)] min-h-72"
        empty={<EmptyState icon={BellOff} title="No notifications match" description="Try clearing a filter." />}
      />
    </div>
  );
}
