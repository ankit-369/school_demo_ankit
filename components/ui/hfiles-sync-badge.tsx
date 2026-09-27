import { CloudOff, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

type HfilesSyncBadgeProps = {
  synced: boolean;
  syncedLabel?: string;
  unsyncedLabel?: string;
  className?: string;
};

/** Teal when something is on hfiles.in; quiet neutral when it isn't. */
export function HfilesSyncBadge({
  synced,
  syncedLabel = "Synced to hfiles.in",
  unsyncedLabel = "Not synced",
  className,
}: HfilesSyncBadgeProps) {
  const Icon = synced ? Link2 : CloudOff;
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
      {synced ? syncedLabel : unsyncedLabel}
    </span>
  );
}
