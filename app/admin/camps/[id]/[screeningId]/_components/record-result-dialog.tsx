"use client";

import { PencilLine } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { RESULT_STATUS } from "@/lib/labels";
import { useAppStore } from "@/lib/store/app-store";
import type { ScreeningResult, ScreeningResultStatus } from "@/lib/types/screening";
import type { Student } from "@/lib/types/student";

type RecordResultDialogProps = {
  campId: string;
  screeningId: string;
  student: Student;
  result?: ScreeningResult;
  disabled?: boolean;
};

export function RecordResultDialog({ campId, screeningId, student, result, disabled }: RecordResultDialogProps) {
  const record = useAppStore((s) => s.recordScreeningResult);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ScreeningResultStatus>(result?.status ?? "completed");
  const [notes, setNotes] = useState(result?.notes ?? "");

  function onOpenChange(next: boolean) {
    if (next) {
      setStatus(result?.status && result.status !== "pending" ? result.status : "completed");
      setNotes(result?.notes ?? "");
    }
    setOpen(next);
  }

  function onSave() {
    record(campId, screeningId, {
      studentId: student.id,
      status,
      notes: notes.trim(),
      ...(status !== "pending" && { reportUrl: `/reports/${screeningId}/${student.id}.pdf` }),
    });
    setOpen(false);
    toast.success(`${student.name}: ${RESULT_STATUS[status].label.toLowerCase()}`);
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={result && result.status !== "pending" ? "Update result" : "Record result"}
      description={student.name}
      trigger={
        <Button variant="ghost" size="sm" className="h-8 text-primary" disabled={disabled} title={disabled ? "Your role can't record results" : undefined}>
          <PencilLine aria-hidden />
          {result && result.status !== "pending" ? "Edit" : "Record"}
        </Button>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onSave}>Save result</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField label="Result" htmlFor="rr-status">
          <NativeSelect
            id="rr-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ScreeningResultStatus)}
            options={(["completed", "follow-up", "pending"] as const).map((s) => ({ value: s, label: RESULT_STATUS[s].label }))}
          />
        </FormField>
        <FormField label="Findings" htmlFor="rr-notes" optional>
          <Textarea id="rr-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Snellen 6/9 right eye. Refer for refraction." />
        </FormField>
      </div>
    </Modal>
  );
}
