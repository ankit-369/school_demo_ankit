"use client";

import { Archive } from "lucide-react";
import { yearLabel } from "@/lib/academic/promotion-plan";
import { cn } from "@/lib/utils";

type ArchiveToggleProps = { count: number; shown: boolean; onToggle: () => void; className?: string };

/** Reveals entries archived by a promotion. Renders nothing when there are none. */
export function ArchiveToggle({ count, shown, onToggle, className }: ArchiveToggleProps) {
  if (count === 0) return null;
  return (
    <button
      type="button"
      aria-pressed={shown}
      onClick={onToggle}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink-soft transition-colors duration-150 hover:bg-surface hover:text-ink pointer-coarse:h-11",
        className,
      )}
    >
      <Archive aria-hidden className="size-4 text-ink-faint" />
      {shown ? "Hide previous years" : `Show previous years (${count})`}
    </button>
  );
}

/** Marks an entry that belongs to a closed academic year. */
export function ArchivedBadge({ year }: { year: string }) {
  return (
    <span className="inline-flex h-5 items-center gap-1 rounded bg-surface px-1.5 text-[11px] font-medium text-ink-soft ring-1 ring-line ring-inset">
      <Archive aria-hidden className="size-3" />
      {yearLabel(year)}
    </span>
  );
}
