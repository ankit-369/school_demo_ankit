"use client";

import { ClipboardCopy, Link2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelSection } from "@/components/ui/panel";
import { formatDate, formatDateTime, formatRelative } from "@/lib/format";
import { can } from "@/lib/permissions";
import { useAppStore } from "@/lib/store/app-store";
import type { Student } from "@/lib/types/student";
import { HfilesSyncButton } from "./hfiles-sync-button";

/** A hfiles.in entry has no school-record equivalent field it can slot straight into, so this appends a one-line reference to the nurse notes instead. */
function noteLine(kind: string, text: string) {
  return `${kind} on file (hfiles.in): ${text}`;
}

/** Read-only mirror of the family's hfiles.in record. Teal = sourced from hfiles.in. Each item can be copied into the school's own record, which stays the editable, authoritative one. */
export function HfilesPanel({ student }: { student: Student }) {
  const role = useAppStore((s) => s.role);
  const update = useAppStore((s) => s.updateSchoolMedicalHistory);
  const canEdit = can(role, "editMedical");
  const { hfiles, school } = student.medicalHistory;
  const synced = hfiles.lastSyncedAt;

  function copyAllergy(allergy: string) {
    update(student.id, { allergies: [...school.allergies, allergy] }, `Allergies added: ${allergy} (copied from hfiles.in)`);
    toast.success(`${allergy} added to the school record`);
  }

  function copyImmunization(i: (typeof hfiles.immunizations)[number]) {
    const line = noteLine("Immunization", `${i.vaccine} (${i.dose}), ${formatDate(i.date)}, ${i.provider}`);
    update(student.id, { notes: school.notes ? `${school.notes}\n${line}` : line }, `Nurse notes updated (copied from hfiles.in: ${i.vaccine})`);
    toast.success("Added to nurse notes");
  }

  function copyLabReport(l: (typeof hfiles.labReports)[number]) {
    const line = noteLine("Lab report", `${l.name}, ${formatDate(l.date)}, ${l.lab} — ${l.summary}`);
    update(student.id, { notes: school.notes ? `${school.notes}\n${line}` : line }, `Nurse notes updated (copied from hfiles.in: ${l.name})`);
    toast.success("Added to nurse notes");
  }

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
          <Lock aria-hidden className="size-3" /> Read-only — belongs to the family&apos;s hfiles.in account ·{" "}
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
              <ul className="flex flex-col gap-1.5">
                {hfiles.allergies.map((a) => {
                  const onSchoolRecord = school.allergies.includes(a);
                  return (
                    <li key={a} className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex h-6 items-center gap-1.5 rounded-md border border-synced/30 bg-synced/5 px-2 text-xs font-medium text-synced-ink">
                        {a}
                      </span>
                      {onSchoolRecord ? (
                        <span className="text-[13px] text-ink-faint">On school record</span>
                      ) : (
                        <>
                          <span className="text-[13px] text-ink-soft">not on school record</span>
                          {canEdit && (
                            <Button variant="ghost" size="sm" className="h-7 text-primary" onClick={() => copyAllergy(a)} title="Copy to school record">
                              <ClipboardCopy aria-hidden />
                              Copy to school record
                            </Button>
                          )}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </PanelSection>
          <PanelSection title="Immunizations">
            {hfiles.immunizations.length === 0 ? (
              <p className="text-sm text-ink-faint">None synced</p>
            ) : (
              <ul className="divide-y divide-line rounded-lg border border-line">
                {hfiles.immunizations.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5 px-4 py-2.5">
                    <span className="text-[15px] text-ink">
                      {i.vaccine} <span className="text-ink-faint">· {i.dose}</span>
                      <span className="block text-[13px] text-ink-faint">{formatDate(i.date)} · {i.provider}</span>
                    </span>
                    {canEdit && (
                      <Button variant="ghost" size="sm" className="h-7 text-primary" onClick={() => copyImmunization(i)} title="Copy to school record">
                        <ClipboardCopy aria-hidden />
                        Copy to school record
                      </Button>
                    )}
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
                  <li key={l.id} className="flex flex-col gap-1 px-4 py-2.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="text-[15px] font-medium text-ink">{l.name}</span>
                      <span className="text-[13px] text-ink-faint">{formatDate(l.date)} · {l.lab}</span>
                    </div>
                    <p className="text-sm text-ink-soft">{l.summary}</p>
                    {canEdit && (
                      <Button variant="ghost" size="sm" className="h-7 w-fit text-primary" onClick={() => copyLabReport(l)} title="Copy to school record">
                        <ClipboardCopy aria-hidden />
                        Copy to school record
                      </Button>
                    )}
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
