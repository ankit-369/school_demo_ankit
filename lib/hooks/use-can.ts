"use client";

import { ROLE_DEFAULT_PERMISSIONS } from "@/lib/data/permissions";
import { ROLE_STAFF_IDS } from "@/lib/data/personas";
import { useAppStore } from "@/lib/store/app-store";
import type { PermissionKey } from "@/lib/types/permission";

/**
 * Whether the current "Viewing as" persona may do something. Reads the live
 * staff record, so toggles on the staff profile take effect immediately.
 */
export function useCan(key: PermissionKey): boolean {
  const role = useAppStore((s) => s.role);
  const staffId = ROLE_STAFF_IDS[role];
  const member = useAppStore((s) => (staffId ? s.staff.find((st) => st.id === staffId) : undefined));
  if (member) return member.status !== "inactive" && member.permissions[key];
  return ROLE_DEFAULT_PERMISSIONS[role][key];
}

/** The staff id the current persona acts as, if any. */
export function useActingStaffId() {
  const role = useAppStore((s) => s.role);
  return ROLE_STAFF_IDS[role];
}
