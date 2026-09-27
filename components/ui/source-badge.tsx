import { Link2, School } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DataSource } from "@/lib/types/source";

type SourceBadgeProps = {
  source: DataSource;
  className?: string;
};

/** Teal is reserved for hfiles.in — it means "synced" everywhere it appears. */
export function SourceBadge({ source, className }: SourceBadgeProps) {
  const synced = source === "hfiles";
  const Icon = synced ? Link2 : School;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-md border px-2 text-xs font-medium whitespace-nowrap",
        synced
          ? "border-synced/30 bg-synced/5 text-synced-ink [&_svg]:text-synced"
          : "border-line bg-canvas text-ink-soft [&_svg]:text-ink-faint",
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5 shrink-0" />
      {synced ? "via hfiles.in" : "School-entered"}
    </span>
  );
}
