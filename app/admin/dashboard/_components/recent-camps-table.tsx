import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateRange } from "@/lib/format";
import { CAMP_PHASE } from "@/lib/labels";
import { campDoctors, campPhase, campProgress, campStandards, standardsLabel } from "@/lib/selectors/camps";
import type { Camp } from "@/lib/types/camp";
import type { Column } from "@/lib/types/table";
import type { Student } from "@/lib/types/student";

type RecentCampsTableProps = {
  camps: Camp[];
  students: Student[];
};

export function RecentCampsTable({ camps, students }: RecentCampsTableProps) {
  const columns: Column<Camp>[] = [
    {
      id: "camp",
      header: "Camp",
      cell: (c) => (
        <div className="flex flex-col">
          <Link href={`/admin/camps/${c.id}`} className="w-fit rounded-sm font-medium text-ink hover:text-primary hover:underline">
            {c.name}
          </Link>
          <span className="text-[13px] text-ink-faint">{formatDateRange(c.startDate, c.endDate)}</span>
        </div>
      ),
    },
    { id: "standard", header: "Standards", cell: (c) => standardsLabel(campStandards(c)) },
    {
      id: "doctor",
      header: "Lead doctors",
      cell: (c) => {
        const [first, ...rest] = campDoctors(c);
        return (
          <span className="text-ink-soft">
            {first}
            {rest.length > 0 && <span className="text-ink-faint"> +{rest.length}</span>}
          </span>
        );
      },
    },
    {
      id: "screened",
      header: "Screened",
      align: "right",
      cell: (c) => {
        const { done, expected } = campProgress(c, students);
        return (
          <>
            {done}
            <span className="text-ink-faint"> / {expected}</span>
          </>
        );
      },
    },
    { id: "status", header: "Status", cell: (c) => <StatusBadge {...CAMP_PHASE[campPhase(c)]} /> },
  ];

  return (
    <DataTable
      caption="Recent health camps"
      columns={columns}
      rows={camps}
      getRowId={(c) => c.id}
      empty={<EmptyState icon={Stethoscope} title="No camps for this class" description="Try another class or view the whole school." />}
    />
  );
}
