import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabBarItem = {
  href: string;
  label: string;
  /** Visible label when `label` is too long for a tab. */
  shortLabel?: string;
  icon: LucideIcon;
  active: boolean;
  /** Shown but not tappable, e.g. a camp tab when no camp is running. */
  disabledReason?: string;
  /** A small count pill on the icon, e.g. items waiting on this tab. Omit or 0 to hide it. */
  badge?: number;
};

type TabBarProps = { label: string; items: TabBarItem[]; className?: string };

/** Fixed bottom tab bar shared by the admin phone layout and the role apps. */
export function TabBar({ label, items, className }: TabBarProps) {
  return (
    <nav
      aria-label={label}
      className={cn("fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur", className)}
    >
      <ul className="mx-auto grid h-(--bottom-nav-height) max-w-2xl" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map(({ href, label: name, shortLabel, icon: Icon, active, disabledReason, badge }) => {
          const body = (
            <>
              <span className={cn("relative flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-150", active && "bg-surface")}>
                <Icon aria-hidden className="size-5" strokeWidth={active ? 2.25 : 2} />
                {Boolean(badge) && (
                  <span
                    aria-hidden
                    className="absolute top-0 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white ring-2 ring-canvas"
                  >
                    {badge}
                  </span>
                )}
              </span>
              {shortLabel ?? name}
            </>
          );
          const base = "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-150";
          const badgeSuffix = badge ? `, ${badge} waiting` : "";
          return (
            <li key={href} className="flex">
              {disabledReason ? (
                <span aria-disabled title={disabledReason} className={cn(base, "cursor-not-allowed text-ink-faint/60")}>
                  {body}
                  <span className="sr-only">, {disabledReason}</span>
                </span>
              ) : (
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={shortLabel || badge ? `${name}${badgeSuffix}` : undefined}
                  className={cn(base, active ? "text-primary" : "text-ink-faint hover:text-ink-soft")}
                >
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
