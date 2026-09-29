"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { summarizeChanges } from "@/lib/audit-diff";
import { formatDate } from "@/lib/format";
import { RESULT_STATUS, SCREENING_TYPE_LABELS } from "@/lib/labels";
import { useAppStore } from "@/lib/store/app-store";
import type { StudentScreeningRow } from "@/lib/selectors/students";
import type { ScreeningResultStatus } from "@/lib/types/screening";

type ResultDialogProps = { row: StudentScreeningRow; studentId: string; studentName: string; canEdit: boolean };

const STATUS_OPTIONS: { value: ScreeningResultStatus; label: string }[] = [
  { value: "completed", label: "Completed" },
  { value: "follow-up", label: "Follow-up required" },
  { value: "pending", label: "Pending" },
];

/** Mock screening report — stands in for the PDF a real system would render. Nurse/admin can also fix the status or notes here. */
export function ResultDialog({ row, studentId, studentName, canEdit }: ResultDialogProps) {
  const { camp, screening, result } = row;
  const updateResult = useAppStore((s) => s.updateScreeningResult);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<ScreeningResultStatus>(result?.status ?? "pending");
  const [notes, setNotes] = useState(result?.notes ?? "");

  if (!result) return null;
  const facts = [
    { label: "Student", value: studentName },
    { label: "Camp", value: camp.name },
    { label: "Screening", value: SCREENING_TYPE_LABELS[screening.type] },
    { label: "Examined by", value: screening.leadDoctor },
    { label: "Date", value: formatDate(screening.date) },
  ];

  function onOpenChange(next: boolean) {
    if (next) {
      setStatus(result!.status);
      setNotes(result!.notes);
      setEditing(false);
    }
  }

  function save() {
    const summary = summarizeChanges(
      [
        { name: "status", label: "Status", format: (v) => RESULT_STATUS[v as ScreeningResultStatus].label },
        { name: "notes", label: "Findings" },
      ],
      { status: result!.status, notes: result!.notes },
      { status, notes },
    );
    if (summary) {
      updateResult(camp.id, screening.id, studentId, { status, notes }, summary);
      toast.success("Result updated");
    }
    setEditing(false);
  }

  return (
    <Modal
      onOpenChange={onOpenChange}
      title={`${SCREENING_TYPE_LABELS[screening.type]} result`}
      trigger={
        <Button variant="ghost" size="sm" className="h-8 text-primary">
          <FileText aria-hidden />
          View result
        </Button>
      }
      footer={
        editing ? (
          <>
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={save}>Save changes</Button>
          </>
        ) : canEdit ? (
          <Button variant="outline" onClick={() => setEditing(true)}>Edit result</Button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-5">
        {editing ? (
          <NativeSelect
            id="result-status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(e) => setStatus(e.target.value as ScreeningResultStatus)}
            className="w-fit"
          />
        ) : (
          <StatusBadge {...RESULT_STATUS[result.status]} className="w-fit" />
        )}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-[13px] text-ink-faint">{f.label}</dt>
              <dd className="text-[15px] font-medium text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-lg bg-surface p-4">
          <p className="text-sm font-medium text-ink-soft">Findings</p>
          {editing ? (
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2" />
          ) : (
            <p className="mt-1 text-[15px] text-ink">{result.notes || "No notes recorded."}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
