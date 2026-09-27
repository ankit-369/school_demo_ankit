"use client";

import { Lock, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Switch } from "@/components/ui/switch";
import { defaultPermissions, PERMISSION_GROUPS, PERMISSIONS } from "@/lib/data/permissions";
import { STAFF_ROLE_LABELS } from "@/lib/labels";
import { useAppStore } from "@/lib/store/app-store";
import type { Staff } from "@/lib/types/staff";

type PermissionsPanelProps = { staff: Staff; canManage: boolean; isSelf: boolean };

export function PermissionsPanel({ staff, canManage, isSelf }: PermissionsPanelProps) {
  const setPermission = useAppStore((s) => s.setStaffPermission);
  const reset = useAppStore((s) => s.resetStaffPermissions);
  const defaults = defaultPermissions(staff.role);
  const granted = PERMISSIONS.filter((p) => staff.permissions[p.key]).length;
  const customised = PERMISSIONS.some((p) => staff.permissions[p.key] !== defaults[p.key]);
  const locked = !canManage || isSelf;

  return (
    <Panel
      title="Permissions"
      description={`${granted} of ${PERMISSIONS.length} granted · changes apply immediately`}
      actions={
        customised && !locked && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-line"
            onClick={() => {
              reset(staff.id);
              toast.success(`Restored ${STAFF_ROLE_LABELS[staff.role].toLowerCase()} defaults`);
            }}
          >
            <RotateCcw aria-hidden />
            Reset to role defaults
          </Button>
        )
      }
    >
      {locked && (
        <p className="flex items-center gap-2 rounded-lg bg-surface px-4 py-3 text-sm text-ink-soft">
          <Lock aria-hidden className="size-4 shrink-0 text-ink-faint" />
          {isSelf ? "You can't change your own permissions — ask another administrator." : "View only — your role can't manage staff access."}
        </p>
      )}
      {PERMISSION_GROUPS.map((group) => (
        <fieldset key={group} className="flex flex-col">
          <legend className="mb-1 text-sm font-medium text-ink-soft">{group}</legend>
          <ul className="divide-y divide-line">
            {PERMISSIONS.filter((p) => p.group === group).map((p) => {
              const on = staff.permissions[p.key];
              const id = `perm-${p.key}`;
              return (
                <li key={p.key} className="flex items-center justify-between gap-4 py-3">
                  <label htmlFor={id} className="flex min-w-0 flex-col">
                    <span className="flex flex-wrap items-center gap-2 text-[15px] font-medium text-ink">
                      {p.label}
                      {on !== defaults[p.key] && (
                        <span className="rounded bg-warning/10 px-1.5 text-[11px] font-medium text-warning-ink">
                          Custom · default {defaults[p.key] ? "on" : "off"}
                        </span>
                      )}
                    </span>
                    <span className="text-[13px] text-ink-faint">{p.description}</span>
                  </label>
                  <Switch
                    id={id}
                    checked={on}
                    disabled={locked}
                    onCheckedChange={(v) => {
                      setPermission(staff.id, p.key, v);
                      toast.success(`${p.label} ${v ? "granted to" : "removed from"} ${staff.name}`);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}
    </Panel>
  );
}
