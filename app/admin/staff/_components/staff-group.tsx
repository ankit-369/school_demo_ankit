import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { STAFF_ROLE_LABELS, STAFF_STATUS } from "@/lib/labels";
import type { Staff } from "@/lib/types/staff";

function classesSummary(classes: string[]) {
  if (classes.length === 0) return null;
  const shown = classes.slice(0, 3).join(", ");
  return classes.length > 3 ? `${shown} +${classes.length - 3}` : shown;
}

export function StaffGroup({ title, members }: { title: string; members: Staff[] }) {
  return (
    <Panel title={title} badge={<span className="text-sm font-normal text-ink-faint">{members.length}</span>} bodyClassName="p-0 gap-0">
      <ul className="divide-y divide-line">
        {members.map((m) => {
          const classes = classesSummary(m.assignedClasses);
          return (
            <li key={m.id}>
              <Link href={`/admin/staff/${m.id}`} className="flex items-center gap-3 px-5 py-3 transition-colors duration-150 hover:bg-surface">
                <StudentAvatar name={m.name} size="md" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium text-ink">{m.name}</span>
                  <span className="truncate text-[13px] text-ink-faint">
                    {STAFF_ROLE_LABELS[m.role]} · {m.department}
                    {classes && <span className="text-ink-soft"> · Classes {classes}</span>}
                  </span>
                </div>
                <span className="hidden truncate text-sm text-ink-soft lg:block lg:w-64">{m.email}</span>
                {m.status !== "active" && <StatusBadge {...STAFF_STATUS[m.status]} />}
                <ChevronRight aria-hidden className="size-4 shrink-0 text-ink-faint" />
              </Link>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
