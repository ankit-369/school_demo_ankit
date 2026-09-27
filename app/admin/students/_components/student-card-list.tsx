import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { HealthFlags } from "@/components/students/health-flags";
import { STUDENT_STATUS } from "@/lib/labels";
import { gradeLabel } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";

/** Phone layout: one tappable row per student instead of a wide table. */
export function StudentCardList({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return <EmptyState icon={Users} title="No students match" description="Try clearing a filter." />;
  }
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-canvas">
      {students.map((s) => (
        <li key={s.id}>
          <Link href={`/admin/students/${s.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-surface">
            <StudentAvatar name={s.name} photoUrl={s.photoUrl} size="md" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate font-medium text-ink">{s.name}</span>
                <span className="shrink-0 text-[13px] text-ink-faint">
                  {gradeLabel(s.grade)}-{s.division} · #{s.rollNumber}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {s.status !== "active" && <StatusBadge {...STUDENT_STATUS[s.status]} />}
                <HealthFlags allergies={s.medicalHistory.school.allergies} conditions={s.medicalHistory.school.conditions} max={2} />
              </div>
            </div>
            <ChevronRight aria-hidden className="size-4 shrink-0 text-ink-faint" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
