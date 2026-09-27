import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max: number;
  /** Accessible name, e.g. "Screening progress". */
  label: string;
  className?: string;
};

/** Thin meter; the numbers are always shown alongside it, never colour alone. */
export function ProgressBar({ value, max, label, className }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max}`}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface ring-1 ring-line ring-inset", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-200 ease-out", pct === 100 ? "bg-success" : "bg-primary")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
