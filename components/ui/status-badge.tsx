import { CircleCheck, CircleDashed, CircleX, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/lib/types/status";

const TONES: Record<StatusTone, { icon: LucideIcon; className: string }> = {
  success: { icon: CircleCheck, className: "bg-success/10 text-success-ink [&_svg]:text-success" },
  warning: { icon: TriangleAlert, className: "bg-warning/10 text-warning-ink [&_svg]:text-warning" },
  danger: { icon: CircleX, className: "bg-danger/10 text-danger-ink [&_svg]:text-danger" },
  neutral: { icon: CircleDashed, className: "bg-surface text-ink-soft [&_svg]:text-ink-faint" },
};

type StatusBadgeProps = {
  tone: StatusTone;
  /** Required: colour is never the only signal. */
  label: string;
  className?: string;
};

export function StatusBadge({ tone, label, className }: StatusBadgeProps) {
  const { icon: Icon, className: toneClass } = TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full pr-2.5 pl-2 text-xs font-medium whitespace-nowrap",
        toneClass,
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5 shrink-0" strokeWidth={2.25} />
      {label}
    </span>
  );
}
