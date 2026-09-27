"use client";

import { Panel, PanelSection } from "@/components/ui/panel";
import { SourceBadge } from "@/components/ui/source-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { HealthFlags } from "@/components/students/health-flags";
import { formatDate } from "@/lib/format";
import { useCan } from "@/lib/hooks/use-can";
import type { Surgery } from "@/lib/types/medical-history";
import type { Student } from "@/lib/types/student";
import { AddSurgeryDialog } from "./add-surgery-dialog";
import { EditSchoolRecordsDialog } from "./edit-school-records-dialog";

const OUTCOME: Record<Surgery["outcome"], Parameters<typeof StatusBadge>[0]> = {
  successful: { tone: "success", label: "Successful" },
  complications: { tone: "danger", label: "Complications" },
  "ongoing-care": { tone: "warning", label: "Ongoing care" },
};

/** Nurse-entered, editable. Never merged with hfiles.in data. */
export function SchoolRecordsPanel({ student }: { student: Student }) {
  const canEdit = useCan("editMedical");
  const { school } = student.medicalHistory;

  return (
    <Panel
      title="School records"
      description={canEdit ? "Entered and maintained by school nurses." : "View only — your role can't edit medical records."}
      badge={<SourceBadge source="school" />}
      actions={canEdit && <EditSchoolRecordsDialog student={student} />}
    >
      <PanelSection title="Allergies">
        <HealthFlags allergies={school.allergies} conditions={[]} max={20} />
      </PanelSection>
      <PanelSection title="Conditions">
        <HealthFlags allergies={[]} conditions={school.conditions} max={20} />
      </PanelSection>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-ink-soft">Surgeries</h3>
          {canEdit && <AddSurgeryDialog studentId={student.id} />}
        </div>
        {school.surgeries.length === 0 ? (
          <p className="text-sm text-ink-faint">None on file</p>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line">
            {school.surgeries.map((sg) => (
              <li key={sg.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="text-[15px] font-medium text-ink">{sg.name}</p>
                  <p className="text-[13px] text-ink-faint">
                    {formatDate(sg.date)} · {sg.hospital}
                  </p>
                </div>
                <StatusBadge {...OUTCOME[sg.outcome]} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <PanelSection title="Nurse notes">
        <p className={school.notes ? "text-[15px] text-ink" : "text-sm text-ink-faint"}>{school.notes || "No notes yet"}</p>
      </PanelSection>
    </Panel>
  );
}
