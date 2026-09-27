import Link from "next/link";
import { Users } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { HfilesSyncBadge } from "@/components/ui/hfiles-sync-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { HealthFlags } from "@/components/students/health-flags";
import { STUDENT_STATUS } from "@/lib/labels";
import { isHfilesConnected } from "@/lib/selectors/students";
import { gradeLabel } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";
import type { Column } from "@/lib/types/table";
import { StudentRowActions } from "./student-row-actions";

const columns: Column<Student>[] = [
  {
    id: "name",
    header: "Student",
    cell: (s) => (
      <div className="flex items-center gap-3">
        <StudentAvatar name={s.name} photoUrl={s.photoUrl} />
        <div className="flex flex-col">
          <Link href={`/admin/students/${s.id}`} className="w-fit rounded-sm font-medium text-ink hover:text-primary hover:underline">
            {s.name}
          </Link>
          <span className="text-[13px] text-ink-faint">{s.hfid}</span>
        </div>
      </div>
    ),
  },
  { id: "class", header: "Class", cell: (s) => `${gradeLabel(s.grade)}-${s.division}` },
  { id: "roll", header: "Roll no.", align: "right", cell: (s) => s.rollNumber },
  { id: "blood", header: "Blood", cell: (s) => <span className="font-medium">{s.bloodGroup}</span> },
  {
    id: "flags",
    header: "Health flags",
    cell: (s) => <HealthFlags allergies={s.medicalHistory.school.allergies} conditions={s.medicalHistory.school.conditions} max={2} />,
  },
  {
    id: "hfiles",
    header: "hfiles.in",
    cell: (s) => <HfilesSyncBadge synced={isHfilesConnected(s)} syncedLabel="Connected" unsyncedLabel="Not connected" />,
  },
  { id: "status", header: "Status", cell: (s) => <StatusBadge {...STUDENT_STATUS[s.status]} /> },
  { id: "actions", header: <span className="sr-only">Actions</span>, align: "right", cell: (s) => <StudentRowActions id={s.id} name={s.name} /> },
];

export function StudentsTable({ students }: { students: Student[] }) {
  return (
    <DataTable
      caption="Students"
      columns={columns}
      rows={students}
      getRowId={(s) => s.id}
      scrollClassName="max-h-[calc(100dvh-280px)] min-h-80"
      empty={<EmptyState icon={Users} title="No students match" description="Try clearing a filter or searching by HFID." />}
    />
  );
}
