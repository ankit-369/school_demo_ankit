export const PERMISSION_KEYS = [
  "viewMedical",
  "editMedical",
  "addNotes",
  "uploadReports",
  "notifyGuardians",
  "manageCamps",
  "recordResults",
  "sendToHfiles",
  "exportData",
  "manageStudents",
  "manageStaff",
  "manageSettings",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export type Permissions = Record<PermissionKey, boolean>;
