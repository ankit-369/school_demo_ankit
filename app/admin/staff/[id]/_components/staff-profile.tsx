"use client";

import Link from "next/link";
import { Eye, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ROLE_STAFF_IDS } from "@/lib/data/personas";
import { useActingStaffId, useCan } from "@/lib/hooks/use-can";
import { ROLE_LABELS, ROLES } from "@/lib/types/role";
import { useAppStore } from "@/lib/store/app-store";
import { AssignmentsPanel } from "./assignments-panel";
import { PermissionsPanel } from "./permissions-panel";
import { StaffHeader } from "./staff-header";

export function StaffProfile({ id }: { id: string }) {
  const staff = useAppStore((s) => s.staff.find((st) => st.id === id));
  const canManage = useCan("manageStaff");
  const isSelf = useActingStaffId() === id;
  const previewRole = ROLES.find((r) => ROLE_STAFF_IDS[r] === id);

  if (!staff) {
    return (
      <EmptyState
        icon={UserX}
        title="Staff member not found"
        description="They may have been removed, or the demo data was reset."
        action={<Button asChild variant="outline"><Link href="/admin/staff">Back to staff</Link></Button>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StaffHeader staff={staff} canManage={canManage} isSelf={isSelf} />
      {previewRole && !isSelf && (
        <p className="flex items-start gap-2 rounded-lg border border-line px-4 py-3 text-sm text-ink-soft">
          <Eye aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-faint" />
          <span>
            Switching the top bar to <strong className="font-medium text-ink">Viewing as {ROLE_LABELS[previewRole]}</strong> shows the app as {staff.name} — changes below take effect there straight away.
          </span>
        </p>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PermissionsPanel staff={staff} canManage={canManage} isSelf={isSelf} />
        </div>
        <div className="lg:col-span-2">
          {staff.role === "teacher" ? (
            <AssignmentsPanel staff={staff} canManage={canManage} />
          ) : (
            <EmptyState icon={Eye} title="Not class-based" description={`${staff.name}'s access isn't tied to specific classes.`} className="rounded-xl border border-dashed border-line" />
          )}
        </div>
      </div>
    </div>
  );
}
