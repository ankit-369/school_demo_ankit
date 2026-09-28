"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isNavActive, PRIMARY_NAV, SECONDARY_NAV } from "./nav-items";
import type { NavItem } from "@/lib/types/nav";

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150",
        active
          ? "bg-surface text-primary before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-r-full before:bg-primary"
          : "text-ink-soft hover:bg-surface hover:text-ink",
      )}
    >
      <item.icon aria-hidden className="size-[18px] shrink-0" />
      {item.label}
    </Link>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="Primary">
        <ul className="flex flex-col gap-0.5">
          {PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isNavActive(pathname, item.href)} />
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label="Oversight">
        <p className="px-3 pb-1 text-xs font-medium text-ink-faint">Oversight</p>
        <ul className="flex flex-col gap-0.5">
          {SECONDARY_NAV.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isNavActive(pathname, item.href)} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
