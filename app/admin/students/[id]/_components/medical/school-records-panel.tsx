"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Panel, PanelSection } from "@/components/ui/panel";
import { SourceBadge } from "@/components/ui/source-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { HealthFlags } from "@/components/students/health-flags";
import { summarizeListChange } from "@/lib/audit-diff";
import { localDateString } from "@/lib/format";
import { formatDate } from "@/lib/format";
import { can } from "@/lib/permissions";
import { splitList } from "@/lib/schemas/student";
import { useAppStore } from "@/lib/store/app-store";
import type { Surgery } from "@/lib/types/medical-history";
import type { Student } from "@/lib/types/student";

const OUTCOME: Record<Surgery["outcome"], Parameters<typeof StatusBadge>[0]> = {
  successful: { tone: "success", label: "Successful" },
  complications: { tone: "danger", label: "Complications" },
  "ongoing-care": { tone: "warning", label: "Ongoing care" },
};

const OUTCOME_OPTIONS = [
  { value: "successful", label: "Successful" },
  { value: "complications", label: "Complications" },
  { value: "ongoing-care", label: "Ongoing care" },
];

function tempId() {
  return `surg-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

type Draft = {
  allergies: string;
  conditions: string;
  familyMaternal: string;
  familyPaternal: string;
  notes: string;
  surgeries: Surgery[];
};

function toDraft(student: Student): Draft {
  const { school } = student.medicalHistory;
  return {
    allergies: school.allergies.join(", "),
    conditions: school.conditions.join(", "),
    familyMaternal: school.familyHistory.maternal.join(", "),
    familyPaternal: school.familyHistory.paternal.join(", "),
    notes: school.notes,
    surgeries: school.surgeries,
  };
}

/** Nurse-entered, editable. Never merged with hfiles.in data. */
export function SchoolRecordsPanel({ student }: { student: Student }) {
  const role = useAppStore((s) => s.role);
  const update = useAppStore((s) => s.updateSchoolMedicalHistory);
  const canEdit = can(role, "editMedical");
  const { school } = student.medicalHistory;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => toDraft(student));

  function start() {
    setDraft(toDraft(student));
    setEditing(true);
  }
  function cancel() {
    setEditing(false);
  }

  function addSurgeryRow() {
    setDraft((d) => ({ ...d, surgeries: [{ id: tempId(), name: "", date: localDateString(), hospital: "", outcome: "successful" }, ...d.surgeries] }));
  }
  function removeSurgeryRow(id: string) {
    setDraft((d) => ({ ...d, surgeries: d.surgeries.filter((s) => s.id !== id) }));
  }
  function patchSurgeryRow(id: string, patch: Partial<Surgery>) {
    setDraft((d) => ({ ...d, surgeries: d.surgeries.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  }

  function save() {
    const allergies = splitList(draft.allergies);
    const conditions = splitList(draft.conditions);
    const familyMaternal = splitList(draft.familyMaternal);
    const familyPaternal = splitList(draft.familyPaternal);
    const notes = draft.notes.trim();
    const surgeries = draft.surgeries.filter((s) => s.name.trim() && s.hospital.trim());
    const surgeryCountChanged = surgeries.length !== school.surgeries.length;

    const parts = [
      summarizeListChange("Allergies", school.allergies, allergies),
      summarizeListChange("Conditions", school.conditions, conditions),
      summarizeListChange("Maternal family history", school.familyHistory.maternal, familyMaternal),
      summarizeListChange("Paternal family history", school.familyHistory.paternal, familyPaternal),
      notes !== school.notes ? "Nurse notes updated" : "",
      surgeryCountChanged ? `Surgeries: ${school.surgeries.length} → ${surgeries.length}` : "",
    ].filter(Boolean);
    const summary = parts.join("; ");

    if (!summary) {
      setEditing(false);
      return;
    }
    update(student.id, { allergies, conditions, familyHistory: { maternal: familyMaternal, paternal: familyPaternal }, notes, surgeries }, summary);
    toast.success("School records updated");
    setEditing(false);
  }

  return (
    <Panel
      title="School records"
      description={canEdit ? "Entered and maintained by school nurses." : "View only — your role can't edit medical records."}
      badge={<SourceBadge source="school" />}
      actions={
        canEdit &&
        (editing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 border-line" onClick={cancel}>Cancel</Button>
            <Button size="sm" className="h-9" onClick={save}>Save</Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="h-9 border-line" onClick={start}>
            <Pencil aria-hidden />
            Edit
          </Button>
        ))
      }
    >
      {editing ? (
        <div className="flex flex-col gap-5">
          <PanelSection title="Allergies">
            <Input value={draft.allergies} onChange={(e) => setDraft((d) => ({ ...d, allergies: e.target.value }))} placeholder="e.g. Peanuts, Penicillin" />
          </PanelSection>
          <PanelSection title="Conditions">
            <Input value={draft.conditions} onChange={(e) => setDraft((d) => ({ ...d, conditions: e.target.value }))} placeholder="e.g. Asthma" />
          </PanelSection>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-ink-soft">Surgeries</h3>
              <Button variant="ghost" size="sm" className="h-8 text-primary" onClick={addSurgeryRow}>
                <Plus aria-hidden />
                Add row
              </Button>
            </div>
            {draft.surgeries.length === 0 ? (
              <p className="text-sm text-ink-faint">None on file</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {draft.surgeries.map((sg) => (
                  <li key={sg.id} className="grid grid-cols-2 gap-2 rounded-lg border border-line p-3 sm:grid-cols-5">
                    <Input value={sg.name} onChange={(e) => patchSurgeryRow(sg.id, { name: e.target.value })} placeholder="Procedure" className="sm:col-span-2" />
                    <Input type="date" value={sg.date} onChange={(e) => patchSurgeryRow(sg.id, { date: e.target.value })} />
                    <Input value={sg.hospital} onChange={(e) => patchSurgeryRow(sg.id, { hospital: e.target.value })} placeholder="Hospital" />
                    <div className="flex items-center gap-1.5">
                      <NativeSelect value={sg.outcome} options={OUTCOME_OPTIONS} onChange={(e) => patchSurgeryRow(sg.id, { outcome: e.target.value as Surgery["outcome"] })} className="flex-1" />
                      <Button variant="ghost" size="icon" className="size-9 shrink-0 text-danger-ink" onClick={() => removeSurgeryRow(sg.id)} aria-label="Remove surgery">
                        <Trash2 aria-hidden className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <PanelSection title="Family history — maternal side">
            <Input value={draft.familyMaternal} onChange={(e) => setDraft((d) => ({ ...d, familyMaternal: e.target.value }))} placeholder="e.g. Type 2 diabetes, Hypertension" />
          </PanelSection>
          <PanelSection title="Family history — paternal side">
            <Input value={draft.familyPaternal} onChange={(e) => setDraft((d) => ({ ...d, familyPaternal: e.target.value }))} placeholder="e.g. Asthma" />
          </PanelSection>
          <PanelSection title="Nurse notes">
            <Textarea rows={3} value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} />
          </PanelSection>
        </div>
      ) : (
        <>
          <PanelSection title="Allergies">
            <HealthFlags allergies={school.allergies} conditions={[]} max={20} />
          </PanelSection>
          <PanelSection title="Conditions">
            <HealthFlags allergies={[]} conditions={school.conditions} max={20} />
          </PanelSection>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-ink-soft">Surgeries</h3>
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
          <PanelSection title="Family history">
            {school.familyHistory.maternal.length === 0 && school.familyHistory.paternal.length === 0 ? (
              <p className="text-sm text-ink-faint">None on file</p>
            ) : (
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <div>
                  <dt className="text-[13px] text-ink-faint">Maternal side</dt>
                  <dd className="text-[15px] text-ink">{school.familyHistory.maternal.join(", ") || "None on file"}</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-ink-faint">Paternal side</dt>
                  <dd className="text-[15px] text-ink">{school.familyHistory.paternal.join(", ") || "None on file"}</dd>
                </div>
              </dl>
            )}
          </PanelSection>
          <PanelSection title="Nurse notes">
            <p className={school.notes ? "text-[15px] text-ink" : "text-sm text-ink-faint"}>{school.notes || "No notes yet"}</p>
          </PanelSection>
        </>
      )}
    </Panel>
  );
}
