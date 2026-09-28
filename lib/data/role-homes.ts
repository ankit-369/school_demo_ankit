import type { Role } from "@/lib/types/role";

/**
 * Where the role switcher takes you when you pick a role outside /admin.
 * The doctor has no app of their own (they use a per-camp link), so it
 * previews the admin app instead.
 */
export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin/dashboard",
  nurse: "/nurse",
  teacher: "/teacher/class",
  doctor: "/admin/dashboard",
};

export const ROLE_APPS: { role: Role; href: string; label: string }[] = [
  { role: "nurse", href: "/nurse", label: "Nurse camp-day mode" },
  { role: "teacher", href: "/teacher/class", label: "Teacher class view" },
  { role: "admin", href: "/admin/dashboard", label: "Admin dashboard" },
];
