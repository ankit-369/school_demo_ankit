"use client";

import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { NativeSelect } from "@/components/ui/native-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { STAFF_ROLE_LABELS, STAFF_STATUS } from "@/lib/labels";
import { useAppStore } from "@/lib/store/app-store";
import type { Staff, StaffStatus } from "@/lib/types/staff";

export function StaffHeader({ staff, canManage, isSelf }: { staff: Staff; canManage: boolean; isSelf: boolean }) {
  const setStatus = useAppStore((s) => s.setStaffStatus);

  return (
    <header className="flex flex-col gap-5">
      <Breadcrumbs items={[{ label: "Staff", href: "/admin/staff" }, { label: staff.name }]} />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <StudentAvatar name={staff.name} size="lg" />
          <div className="flex min-w-0 flex-col gap-2">
            <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{staff.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-6 items-center rounded-md bg-surface px-2 text-xs font-medium text-ink-soft ring-1 ring-line ring-inset">
                {STAFF_ROLE_LABELS[staff.role]} · {staff.department}
              </span>
              <StatusBadge {...STAFF_STATUS[staff.status]} />
              {isSelf && <span className="text-[13px] text-ink-faint">This is you</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-col gap-1 text-sm text-ink-soft">
            <a href={`mailto:${staff.email}`} className="inline-flex items-center gap-2 hover:text-ink">
              <Mail aria-hidden className="size-4 text-ink-faint" /> {staff.email}
            </a>
            <span className="inline-flex items-center gap-2">
              <Phone aria-hidden className="size-4 text-ink-faint" /> {staff.phone}
            </span>
          </div>
          <NativeSelect
            aria-label="Employment status"
            value={staff.status}
            disabled={!canManage || isSelf}
            onChange={(e) => {
              const status = e.target.value as StaffStatus;
              setStatus(staff.id, status, "Changed on staff profile");
              toast.success(`${staff.name} marked ${STAFF_STATUS[status].label.toLowerCase()}`);
            }}
            options={[
              { value: "active", label: "Active" },
              { value: "on-leave", label: "On leave" },
              { value: "inactive", label: "Inactive — no access" },
            ]}
            className="sm:w-52"
          />
        </div>
      </div>
    </header>
  );
}
