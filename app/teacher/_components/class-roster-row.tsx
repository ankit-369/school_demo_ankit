import Link from "next/link";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { HealthFlags } from "@/components/students/health-flags";
import { classKey } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";

export const hasHealthAlert = (s: Student) => s.medicalHistory.school.allergies.length + s.medicalHistory.school.conditions.length > 0;

export function ClassRosterRow({ student: s }: { student: Student }) {
  const { allergies, conditions } = s.medicalHistory.school;
  return (
    <li>
      <Link href={`/teacher/class/${s.id}/alert`} className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-surface">
        <StudentAvatar name={s.name} photoUrl={s.photoUrl} size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate text-[16px] font-medium text-ink">{s.name}</span>
            <span className="shrink-0 text-[13px] text-ink-faint">{classKey(s.grade, s.division)} · #{s.rollNumber}</span>
          </span>
          <HealthFlags allergies={allergies} conditions={conditions} max={3} />
        </div>
        {hasHealthAlert(s) && <ShieldAlert aria-label="Has an action plan" className="size-5 shrink-0 text-danger" />}
        <ChevronRight aria-hidden className="size-5 shrink-0 text-ink-faint" />
      </Link>
    </li>
  );
}
