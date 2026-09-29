import type { Role } from "@/lib/types/role";
import type { StaffRole } from "@/lib/types/staff";

/** Roles this module reasons about — every staff role, plus the non-staff "doctor" viewing role. */
export type PermissionRole = StaffRole | Extract<Role, "doctor">;

export type Action = "notifyGuardian" | "editMedical" | "editDemographics";

/**
 * Who may message a guardian directly about a clinical note. This is a fixed
 * business rule (a class teacher or admin, not the nurse) — separate from the
 * per-staff `notifyGuardians` permission, which still governs the unrelated
 * consent- and report-reminder flows.
 */
const CAN_NOTIFY_GUARDIAN: PermissionRole[] = ["admin", "principal", "teacher"];

/** Height/weight/blood group/allergies/notes/clinical notes/reports — health data. */
const CAN_EDIT_MEDICAL: PermissionRole[] = ["admin", "principal", "nurse"];

/** Name/DOB/class/guardian/house/transport — everything else on a profile. Wider than editMedical: a registrar edits these but not health data. */
const CAN_EDIT_DEMOGRAPHICS: PermissionRole[] = ["admin", "principal", "nurse", "registrar"];

export function can(role: PermissionRole, action: Action): boolean {
  switch (action) {
    case "notifyGuardian":
      return CAN_NOTIFY_GUARDIAN.includes(role);
    case "editMedical":
      return CAN_EDIT_MEDICAL.includes(role);
    case "editDemographics":
      return CAN_EDIT_DEMOGRAPHICS.includes(role);
    default:
      return false;
  }
}
