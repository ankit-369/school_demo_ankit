"use client";

import { Search } from "lucide-react";
import { NativeSelect } from "@/components/ui/native-select";
import { CHANNEL_LABELS, NOTIFICATION_TYPE_LABELS } from "@/lib/labels";
import { EMPTY_NOTIFICATIONS_FILTER, type NotificationsFilter } from "@/lib/selectors/notifications-log";

type NotificationsFiltersProps = { value: NotificationsFilter; onChange: (next: NotificationsFilter) => void };

export function NotificationsFilters({ value, onChange }: NotificationsFiltersProps) {
  const set = (key: keyof NotificationsFilter) => (e: { target: { value: string } }) => onChange({ ...value, [key]: e.target.value });

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative lg:w-72">
        <label htmlFor="ntf-search" className="sr-only">Search notifications</label>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
        <input
          id="ntf-search"
          type="search"
          value={value.query}
          onChange={set("query")}
          placeholder="Student, HFID or message"
          className="h-10 pointer-coarse:h-11 pointer-coarse:text-base w-full rounded-lg border border-input bg-canvas pr-3 pl-9 text-sm text-ink outline-none placeholder:text-ink-faint focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
      </div>
      <div className="grid grid-cols-3 gap-3 lg:flex lg:flex-1">
        <NativeSelect aria-label="Type" value={value.type} onChange={set("type")} placeholder="All types" options={Object.entries(NOTIFICATION_TYPE_LABELS).map(([v, label]) => ({ value: v, label }))} className="lg:w-52" />
        <NativeSelect aria-label="Channel" value={value.channel} onChange={set("channel")} placeholder="All channels" options={Object.entries(CHANNEL_LABELS).map(([v, label]) => ({ value: v, label }))} className="lg:w-40" />
        <NativeSelect
          aria-label="Status"
          value={value.status}
          onChange={set("status")}
          placeholder="All statuses"
          options={[{ value: "sent", label: "Sent" }, { value: "delivered", label: "Delivered" }, { value: "failed", label: "Failed" }]}
          className="lg:w-40"
        />
      </div>
      {JSON.stringify(value) !== JSON.stringify(EMPTY_NOTIFICATIONS_FILTER) && (
        <button type="button" onClick={() => onChange(EMPTY_NOTIFICATIONS_FILTER)} className="self-start text-sm font-medium text-ink-soft hover:text-ink lg:self-auto">
          Clear filters
        </button>
      )}
    </div>
  );
}
