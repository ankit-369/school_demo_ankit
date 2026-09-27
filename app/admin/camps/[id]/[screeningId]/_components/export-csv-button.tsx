"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import { GatedButton } from "@/components/ui/gated-button";
import { downloadCsv, slugify, toCsv } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";
import { useCan } from "@/lib/hooks/use-can";
import { RESULT_STATUS, SCREENING_TYPE_LABELS } from "@/lib/labels";
import type { ResultRow } from "@/lib/selectors/screening-results";
import type { Camp } from "@/lib/types/camp";
import type { Screening } from "@/lib/types/screening";

type ExportCsvButtonProps = { camp: Camp; screening: Screening; rows: ResultRow[]; scope: string };

const HEADERS = ["HFID", "Admission no.", "Student", "Class", "Roll no.", "Result", "Findings", "Examined by", "Screening date", "Report", "Sent to hfiles.in", "hfiles.in last synced"];

/** Builds the CSV from exactly the rows on screen (respecting the class tab). */
export function ExportCsvButton({ camp, screening, rows, scope }: ExportCsvButtonProps) {
  const can = useCan("exportData");

  function onExport() {
    const csv = toCsv(
      HEADERS,
      rows.map(({ student: s, classKey, result, sentToHfiles }) => [
        s.hfid,
        s.admissionNo,
        s.name,
        classKey,
        s.rollNumber,
        result ? RESULT_STATUS[result.status].label : "Not screened",
        result?.notes ?? "",
        screening.leadDoctor,
        screening.date,
        result?.reportUrl ?? "",
        sentToHfiles ? "Yes" : "No",
        s.medicalHistory.hfiles.lastSyncedAt ? formatDateTime(s.medicalHistory.hfiles.lastSyncedAt) : "Not connected",
      ]),
    );
    const name = `${slugify(`${SCREENING_TYPE_LABELS[screening.type]} ${camp.name} ${scope}`)}.csv`;
    downloadCsv(name, csv);
    toast.success(`Exported ${rows.length} rows`, { description: name });
  }

  return (
    <GatedButton variant="outline" className="border-line" allowed={can} icon={Download} lockedReason="Your role can't export data" onClick={onExport} disabled={rows.length === 0}>
      Export CSV
    </GatedButton>
  );
}
