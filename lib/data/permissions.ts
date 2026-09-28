import type { PermissionKey, Permissions } from "@/lib/types/permission";
import type { Role } from "@/lib/types/role";
import type { StaffRole } from "@/lib/types/staff";

export type PermissionGroup = "Health records" | "Health camps" | "Communication" | "Administration";

export const PERMISSIONS: { key: PermissionKey; label: string; description: string; group: PermissionGroup }[] = [
  { key: "viewMedical", label: "View medical records", description: "Allergies, conditions and hfiles.in data", group: "Health records" },
  { key: "editMedical", label: "Edit school medical records", description: "Allergies, conditions, surgeries and nurse notes", group: "Health records" },
  { key: "addNotes", label: "Add clinical notes", description: "Record medical-room visits and incidents", group: "Health records" },
  { key: "logIncidents", label: "Log classroom incidents", description: "Quick incident reports, saved to the student's notes for the nurse", group: "Health records" },
  { key: "uploadReports", label: "Upload reports", description: "Saved to the school record and pushed to hfiles.in", group: "Health records" },
  { key: "notifyGuardians", label: "Message guardians", description: "Send SMS or WhatsApp updates with a clinical note", group: "Communication" },
  { key: "manageCamps", label: "Schedule health camps", description: "Create camps and add screenings", group: "Health camps" },
  { key: "recordResults", label: "Record screening results", description: "Mark students completed or needing follow-up", group: "Health camps" },
  { key: "sendToHfiles", label: "Send results to hfiles.in", description: "Push screening results to families' records", group: "Health camps" },
  { key: "exportData", label: "Export data", description: "Download results and directories as CSV", group: "Administration" },
  { key: "manageStudents", label: "Add and edit students", description: "Admissions, class changes and promotions", group: "Administration" },
  { key: "manageStaff", label: "Manage staff access", description: "Add faculty and change these permissions", group: "Administration" },
  { key: "manageSettings", label: "Manage school settings", description: "School profile, notification templates and integrations", group: "Administration" },
];

export const PERMISSION_GROUPS: PermissionGroup[] = ["Health records", "Health camps", "Communication", "Administration"];

function grant(...keys: PermissionKey[]): Permissions {
  return Object.fromEntries(PERMISSIONS.map((p) => [p.key, keys.includes(p.key)])) as Permissions;
}

const ALL = PERMISSIONS.map((p) => p.key);
const CLINICAL: PermissionKey[] = ["viewMedical", "editMedical", "addNotes", "logIncidents", "uploadReports", "notifyGuardians", "recordResults", "sendToHfiles"];

/** Starting permissions for each staff role (and the non-staff "doctor" viewing role). */
export const ROLE_DEFAULT_PERMISSIONS: Record<StaffRole | Extract<Role, "doctor">, Permissions> = {
  principal: grant(...ALL),
  admin: grant(...ALL),
  nurse: grant(...CLINICAL),
  teacher: grant("viewMedical", "logIncidents"),
  registrar: grant("manageStudents", "exportData"),
  doctor: grant("viewMedical", "editMedical", "addNotes", "uploadReports", "recordResults", "sendToHfiles"),
};

export function defaultPermissions(role: StaffRole): Permissions {
  return { ...ROLE_DEFAULT_PERMISSIONS[role] };
}
