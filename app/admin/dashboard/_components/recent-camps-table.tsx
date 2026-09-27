import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Column } from "@/lib/types/table";
import type { StatusTone } from "@/lib/types/status";
import { PLACEHOLDER_CAMPS, type CampRow } from "./placeholder-data";

const STATUS: Record<CampRow["status"], { tone: StatusTone; label: string }> = {
  complete: { tone: "success", label: "Complete" },
  "in-progress": { tone: "neutral", label: "In progress" },
  overdue: { tone: "warning", label: "Reports overdue" },
};

const columns: Column<CampRow>[] = [
  { id: "date", header: "Date", cell: (r) => <span className="text-ink-soft">{r.date}</span> },
  { id: "standard", header: "Standard", cell: (r) => <span className="font-medium">{r.standard}</span> },
  { id: "doctor", header: "Lead doctor", cell: (r) => r.leadDoctor },
  {
    id: "screened",
    header: "Screened",
    align: "right",
    cell: (r) => (
      <>
        {r.screened}
        <span className="text-ink-faint"> / {r.total}</span>
      </>
    ),
  },
  { id: "status", header: "Status", cell: (r) => <StatusBadge {...STATUS[r.status]} /> },
];

export function RecentCampsTable() {
  return (
    <DataTable
      caption="Recent health camps"
      columns={columns}
      rows={PLACEHOLDER_CAMPS}
      getRowId={(r) => r.id}
    />
  );
}
