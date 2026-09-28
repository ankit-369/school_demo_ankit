import Link from "next/link";
import { ChevronRight, TriangleAlert } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { RESULT_STATUS } from "@/lib/labels";
import { isAbsent } from "@/lib/selectors/camp-day";
import type { ResultRow } from "@/lib/selectors/screening-results";

/** 64px-tall tap target: who, which class, allergy warning, and where they are in the station. */
export function RosterRow({ row, href }: { row: ResultRow; href: string }) {
  const { student: s, result } = row;
  const allergies = s.medicalHistory.school.allergies;
  return (
    <li>
      <Link href={href} className="flex min-h-16 items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-surface active:bg-surface">
        <StudentAvatar name={s.name} photoUrl={s.photoUrl} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-medium text-ink">{s.name}</p>
          <p className="flex items-center gap-1.5 text-[13px] text-ink-faint">
            {row.classKey} · Roll {s.rollNumber}
            {allergies.length > 0 && (
              <span className="inline-flex items-center gap-1 text-danger-ink">
                <TriangleAlert aria-hidden className="size-3.5 text-danger" />
                {allergies.join(", ")}
              </span>
            )}
          </p>
        </div>
        {isAbsent(row) ? (
          <StatusBadge tone="neutral" label="Absent" className="shrink-0" />
        ) : result && result.status !== "pending" ? (
          <StatusBadge {...RESULT_STATUS[result.status]} className="shrink-0" />
        ) : (
          <StatusBadge tone="neutral" label="To do" className="shrink-0" />
        )}
        <ChevronRight aria-hidden className="size-5 shrink-0 text-ink-faint" />
      </Link>
    </li>
  );
}
