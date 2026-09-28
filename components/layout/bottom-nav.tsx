"use client";

import { usePathname } from "next/navigation";
import { PRIMARY_NAV, isNavActive } from "./nav-items";
import { TabBar } from "./tab-bar";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <TabBar
      label="Primary"
      className="md:hidden"
      items={PRIMARY_NAV.map((item) => ({ ...item, active: isNavActive(pathname, item.href) }))}
    />
  );
}
