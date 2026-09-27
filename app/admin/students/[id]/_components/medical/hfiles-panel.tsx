import { Link2, Lock } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelSection } from "@/components/ui/panel";
import { formatDate, formatDateTime, formatRelative } from "@/lib/format";
import type { Student } from "@/lib/types/student";
import { HfilesSyncButton } from "./hfiles-sync-button";

/** Read-only mirror of the family's hfiles.in record. Teal = sourced from hfiles.in. */
export function HfilesPanel({ student }: { student: Student }) {
  const { hfiles, school } = student.medicalHistory;
  const synced = hfiles.lastSyncedAt;

  return (
    <Panel
      className="border-synced/40"
      headerClassName="border-synced/20 bg-synced/5 rounded-t-xl"
      title={
        <span className="inline-flex items-center gap-2 text-synced-ink">
          <Link2 aria-hidden className="size-[18px] text-synced" />
          hfiles.in synced data
        </span>
      }
      description={
        <span className="inline-flex flex-wrap items-center gap-1">
          <Lock aria-hidden className="size-3" /> Read-only ·{" "}
          {synced ? (
            <time dateTime={synced} title={formatDateTime(synced)}>
              Last synced {formatRelative(synced)}
            </time>
          ) : (
            "Not connected yet"
          )}
        </span>
      }
      actions={<HfilesSyncButton studentId={student.id} connected={Boolean(synced)} />}
    >
      {!synced ? (
        <EmptyState
          icon={Link2}
          title="Not connected yet"
          description="Once the family links their hfiles.in account, immunizations and lab reports appear here automatically."
          className="py-8"
        />
      ) : (
        <>
          <PanelSection title="Allergies reported by family">
            {hfiles.allergies.length === 0 ? (
              <p className="text-sm text-ink-faint">None reported</p>
            ) : (
              <ul className="flex flex-wrap gap-1.5">
                {hfiles.allergies.map((a) => (
                  <li key={a} className="inline-flex h-6 items-center gap-1.5 rounded-md border border-synced/30 bg-synced/5 px-2 text-xs font-medium text-synced-ink">
                    {a}
                    {!school.allergies.includes(a) && <span className="font-normal text-ink-soft">· not on school record</span>}
                  </li>
                ))}
              </ul>
            )}
          </PanelSection>
          <PanelSection title="Immunizations">
            {hfiles.immunizations.length === 0 ? (
              <p className="text-sm text-ink-faint">None synced</p>
            ) : (
              <ul className="divide-y divide-line rounded-lg border border-line">
                {hfiles.immunizations.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-4 py-2.5">
                    <span className="text-[15px] text-ink">
                      {i.vaccine} <span className="text-ink-faint">· {i.dose}</span>
                    </span>
                    <span className="text-[13px] text-ink-faint">{formatDate(i.date)} · {i.provider}</span>
                  </li>
                ))}
              </ul>
            )}
          </PanelSection>
          <PanelSection title="Lab reports">
            {hfiles.labReports.length === 0 ? (
              <p className="text-sm text-ink-faint">None synced</p>
            ) : (
              <ul className="divide-y divide-line rounded-lg border border-line">
                {hfiles.labReports.map((l) => (
                  <li key={l.id} className="flex flex-col gap-0.5 px-4 py-2.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="text-[15px] font-medium text-ink">{l.name}</span>
                      <span className="text-[13px] text-ink-faint">{formatDate(l.date)} · {l.lab}</span>
                    </div>
                    <p className="text-sm text-ink-soft">{l.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </PanelSection>
        </>
      )}
    </Panel>
  );
}
