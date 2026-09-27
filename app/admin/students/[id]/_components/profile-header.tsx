import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { HfilesSyncBadge } from "@/components/ui/hfiles-sync-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { ageFromDob, capitalize } from "@/lib/format";
import { STUDENT_STATUS } from "@/lib/labels";
import { isHfilesConnected } from "@/lib/selectors/students";
import { gradeLabel } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";

type ProfileHeaderProps = {
  student: Student;
  teacherName: string;
};

export function ProfileHeader({ student: s, teacherName }: ProfileHeaderProps) {
  const facts = [
    { label: "Class", value: `${gradeLabel(s.grade)}-${s.division}` },
    { label: "Roll no.", value: String(s.rollNumber) },
    { label: "Class teacher", value: teacherName },
    { label: "Age / gender", value: `${ageFromDob(s.dob)} yrs · ${capitalize(s.gender)}` },
    { label: "Blood group", value: s.bloodGroup },
  ];

  return (
    <header className="flex flex-col gap-5">
      <Link href="/admin/students" className="inline-flex w-fit items-center gap-1 rounded-sm text-sm font-medium text-ink-soft hover:text-ink">
        <ChevronLeft aria-hidden className="size-4" />
        Students
      </Link>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <StudentAvatar name={s.name} photoUrl={s.photoUrl} size="lg" />
          <div className="flex min-w-0 flex-col gap-2">
            <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{s.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-6 items-center rounded-md bg-surface px-2 text-xs font-medium text-ink-soft ring-1 ring-line ring-inset">
                HFID {s.hfid}
              </span>
              <HfilesSyncBadge synced={isHfilesConnected(s)} syncedLabel="hfiles.in connected" unsyncedLabel="hfiles.in not connected" />
              {s.status !== "active" && <StatusBadge {...STUDENT_STATUS[s.status]} />}
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:flex lg:gap-8">
          {facts.map((f) => (
            <div key={f.label} className="min-w-0">
              <dt className="text-[13px] text-ink-faint">{f.label}</dt>
              <dd className="truncate text-[15px] font-medium text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
