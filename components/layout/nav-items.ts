import { BellRing, FileCheck, FolderOpen, History, LayoutGrid, Settings, Stethoscope, Users, UserCog } from "lucide-react";
import type { NavItem } from "@/lib/types/nav";

/** Five items so the mobile bottom bar maps 1:1 to these. */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", shortLabel: "Home", icon: LayoutGrid },
  { href: "/admin/camps", label: "Health camps", shortLabel: "Camps", icon: Stethoscope },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/staff", label: "Profile & staff", shortLabel: "Staff", icon: UserCog },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/** Oversight pages: desktop sidebar only (see Settings for a mobile-reachable copy of these links). */
export const SECONDARY_NAV: NavItem[] = [
  { href: "/admin/notifications-log", label: "Notifications log", icon: BellRing },
  { href: "/admin/consent", label: "Consent forms", icon: FileCheck },
  { href: "/admin/reports", label: "Reports", icon: FolderOpen },
  { href: "/admin/audit-log", label: "Audit log", icon: History },
];


export function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
