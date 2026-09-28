import Link from "next/link";
import { CloudOff, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { formatDateTime, formatRelative } from "@/lib/format";
import type { SyncRow } from "@/lib/selectors/integrations";
import { classKey } from "@/lib/types/grade";

export function RecentSyncsPanel({ rows }: { rows: SyncRow[] }) {
  return (
    <Panel title="Recent syncs" description="Pulled from each student's hfiles.in sync time, most recent first." bodyClassName="p-0 gap-0">
      {rows.length === 0 ? (
        <EmptyState icon={CloudOff} title="No syncs yet" description="Connect a student's record from their Medical History tab." />
      ) : (
        <ul className="divide-y divide-line">
          {rows.map(({ student: s, syncedAt }) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw aria-hidden className="size-3.5 shrink-0 text-synced" />
                <Link href={`/admin/students/${s.id}/medical-history`} className="rounded-sm font-medium text-ink hover:text-primary hover:underline">{s.name}</Link>
                <span className="text-ink-faint">{classKey(s.grade, s.division)}</span>
              </div>
              <time dateTime={syncedAt} title={formatDateTime(syncedAt)} className="shrink-0 text-[13px] text-ink-faint">
                {formatRelative(syncedAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
