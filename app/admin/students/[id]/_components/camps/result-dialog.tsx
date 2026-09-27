"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { RESULT_STATUS, SCREENING_TYPE_LABELS } from "@/lib/labels";
import type { StudentScreeningRow } from "@/lib/selectors/students";

type ResultDialogProps = { row: StudentScreeningRow; studentName: string };

/** Mock screening report — stands in for the PDF a real system would render. */
export function ResultDialog({ row, studentName }: ResultDialogProps) {
  const { camp, screening, result } = row;
  if (!result) return null;
  const facts = [
    { label: "Student", value: studentName },
    { label: "Camp", value: camp.name },
    { label: "Screening", value: SCREENING_TYPE_LABELS[screening.type] },
    { label: "Examined by", value: screening.leadDoctor },
    { label: "Date", value: formatDate(screening.date) },
  ];

  return (
    <Modal
      title={`${SCREENING_TYPE_LABELS[screening.type]} result`}
      trigger={
        <Button variant="ghost" size="sm" className="h-8 text-primary">
          <FileText aria-hidden />
          View result
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <StatusBadge {...RESULT_STATUS[result.status]} className="w-fit" />
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
          <p className="mt-1 text-[15px] text-ink">{result.notes || "No notes recorded."}</p>
        </div>
      </div>
    </Modal>
  );
}
