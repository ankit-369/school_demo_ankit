"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TabNavItem = { href: string; label: string };

type TabNavProps = {
  items: TabNavItem[];
  label: string;
  className?: string;
};

/** Route-driven tabs with a single underline that glides to the active tab. */
export function TabNav({ items, label, className }: TabNavProps) {
  const pathname = usePathname();
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);
  const activeIndex = items.findIndex((t) => t.href === pathname);

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[activeIndex];
      setBar(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
      el?.scrollIntoView({ block: "nearest", inline: "nearest" });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  return (
    <nav aria-label={label} className={cn("relative border-b border-line", className)}>
      <ul className="-mb-px flex overflow-x-auto [scrollbar-width:none]">
        {items.map((tab, i) => {
          const active = i === activeIndex;
          return (
            <li key={tab.href} className="shrink-0">
              <Link
                ref={(el) => {
                  refs.current[i] = el;
                }}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150",
                  active ? "text-primary" : "text-ink-soft hover:text-ink",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {bar && (
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-[transform,width] duration-200 ease-out"
          style={{ width: bar.width, transform: `translateX(${bar.left}px)` }}
        />
      )}
    </nav>
  );
}
