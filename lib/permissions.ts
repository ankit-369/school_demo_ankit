import type { Role } from "@/lib/types/role";
import type { StaffRole } from "@/lib/types/staff";

/** Roles this module reasons about — every staff role, plus the non-staff "doctor" viewing role. */
export type PermissionRole = StaffRole | Extract<Role, "doctor">;

export type Action = "notifyGuardian";

/**
 * Who may message a guardian directly about a clinical note. This is a fixed
 * business rule (a class teacher or admin, not the nurse) — separate from the
 * per-staff `notifyGuardians` permission, which still governs the unrelated
 * consent- and report-reminder flows.
 */
const CAN_NOTIFY_GUARDIAN: PermissionRole[] = ["admin", "principal", "teacher"];

export function can(role: PermissionRole, action: Action): boolean {
  switch (action) {
    case "notifyGuardian":
      return CAN_NOTIFY_GUARDIAN.includes(role);
    default:
      return false;
  }
}
