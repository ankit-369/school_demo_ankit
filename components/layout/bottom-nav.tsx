"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, isNavActive } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid h-(--bottom-nav-height) grid-cols-5">
        {PRIMARY_NAV.map(({ href, label, shortLabel, icon: Icon }) => {
          const active = isNavActive(pathname, href);
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className={cn(
                  "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-150",
                  active ? "text-primary" : "text-ink-faint hover:text-ink-soft",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-150",
                    active && "bg-surface",
                  )}
                >
                  <Icon aria-hidden className="size-5" strokeWidth={active ? 2.25 : 2} />
                </span>
                {shortLabel ?? label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
