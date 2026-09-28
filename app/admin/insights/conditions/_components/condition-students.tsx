import Link from "next/link";
import { Phone } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { SourceBadge } from "@/components/ui/source-badge";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { HealthFlags } from "@/components/students/health-flags";
import type { ConditionGroup } from "@/lib/selectors/insights-conditions";
import { gradeLabel } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";

function StudentRow({ s, hfilesOnly }: { s: Student; hfilesOnly?: boolean }) {
  const { school } = s.medicalHistory;
  return (
    <li className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <StudentAvatar name={s.name} photoUrl={s.photoUrl} size="md" />
        <div className="min-w-0">
          <Link href={`/admin/students/${s.id}/medical-history`} className="rounded-sm font-medium text-ink hover:text-primary hover:underline">
            {s.name}
          </Link>
          <p className="text-[13px] text-ink-faint">
            {gradeLabel(s.grade)}-{s.division} · Roll {s.rollNumber} · {s.bloodGroup}
          </p>
          {school.notes && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{school.notes}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:w-80 sm:justify-end">
        {hfilesOnly ? <SourceBadge source="hfiles" /> : <HealthFlags allergies={school.allergies} conditions={school.conditions} max={3} />}
        <a href={`tel:${s.guardian.phone.replace(/\s/g, "")}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line px-2.5 text-[13px] font-medium text-ink hover:bg-surface">
          <Phone aria-hidden className="size-3.5 text-ink-faint" />
          {s.guardian.name.split(" ")[0]}
        </a>
      </div>
    </li>
  );
}

export function ConditionStudents({ group }: { group: ConditionGroup }) {
  const noun = group.kind === "allergy" ? `${group.label} allergy` : group.label;
  return (
    <div className="flex flex-col gap-6">
      <Panel
        title={`${noun} · ${group.students.length} ${group.students.length === 1 ? "student" : "students"}`}
        description="From the school record. Open a student for their full medical history."
        badge={<SourceBadge source="school" />}
        bodyClassName="p-0 gap-0"
      >
        {group.students.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink-faint">No students on the school record — see hfiles.in reports below.</p>
        ) : (
          <ul className="divide-y divide-line">{group.students.map((s) => <StudentRow key={s.id} s={s} />)}</ul>
        )}
      </Panel>
      {group.hfilesOnly.length > 0 && (
        <Panel
          className="border-synced/40"
          headerClassName="rounded-t-xl border-synced/20 bg-synced/5"
          title={<span className="text-synced-ink">Reported on hfiles.in only · {group.hfilesOnly.length}</span>}
          description="The family's hfiles.in record lists this, but the school record doesn't. Worth confirming with the guardian."
          bodyClassName="p-0 gap-0"
        >
          <ul className="divide-y divide-line">{group.hfilesOnly.map((s) => <StudentRow key={s.id} s={s} hfilesOnly />)}</ul>
        </Panel>
      )}
    </div>
  );
}
