import { LayoutGrid, Settings, Stethoscope, Users, UserCog } from "lucide-react";
import type { NavItem } from "@/lib/types/nav";

/** Five items so the mobile bottom bar maps 1:1 to the desktop sidebar. */
export const ADMIN_NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", shortLabel: "Home", icon: LayoutGrid },
  { href: "/admin/camps", label: "Health camps", shortLabel: "Camps", icon: Stethoscope },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/staff", label: "Profile & staff", shortLabel: "Staff", icon: UserCog },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
