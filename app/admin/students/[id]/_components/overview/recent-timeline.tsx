import { ClipboardCheck, FileText, History, Link2, NotebookPen, type LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatRelative } from "@/lib/format";
import type { TimelineItem, TimelineKind } from "@/lib/selectors/timeline";
import { cn } from "@/lib/utils";

const ICONS: Record<TimelineKind, LucideIcon> = {
  note: NotebookPen,
  screening: ClipboardCheck,
  report: FileText,
  sync: Link2,
};

export function RecentTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <Panel title="Recent activity" bodyClassName="py-2">
      {items.length === 0 ? (
        <EmptyState icon={History} title="Nothing yet" description="Notes, screenings and reports will show up here." />
      ) : (
        <ol className="flex flex-col">
          {items.map((item, i) => {
            const Icon = ICONS[item.kind];
            const synced = item.kind === "sync";
            return (
              <li key={item.id} className="relative flex gap-3 py-3">
                {i < items.length - 1 && <span aria-hidden className="absolute top-12 bottom-0 left-[17px] w-px bg-line" />}
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    synced ? "bg-synced/10 text-synced" : "bg-surface text-ink-soft",
                  )}
                >
                  <Icon aria-hidden className="size-4" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    {item.tone && item.toneLabel && <StatusBadge tone={item.tone} label={item.toneLabel} />}
                  </div>
                  <p className="line-clamp-2 text-sm text-ink-soft">{item.detail}</p>
                  <time dateTime={item.date} title={formatDate(item.date)} className="text-[13px] text-ink-faint">
                    {formatRelative(item.date)}
                  </time>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}
