export const ROLES = ["admin", "nurse", "teacher", "doctor"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  nurse: "Nurse",
  teacher: "Teacher",
  doctor: "Doctor",
};
