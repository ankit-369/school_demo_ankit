import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  /** Shorter label for the mobile bottom bar, if it differs. */
  shortLabel?: string;
  icon: LucideIcon;
};
