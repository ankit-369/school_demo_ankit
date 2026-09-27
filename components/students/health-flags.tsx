import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type HealthFlagsProps = {
  allergies: string[];
  conditions: string[];
  /** Show at most this many chips, then "+N". */
  max?: number;
  className?: string;
};

/** Allergies read as warnings (icon + red tint); conditions stay neutral. */
export function HealthFlags({ allergies, conditions, max = 3, className }: HealthFlagsProps) {
  const flags = [
    ...allergies.map((label) => ({ label, allergy: true })),
    ...conditions.map((label) => ({ label, allergy: false })),
  ];
  if (flags.length === 0) return <span className="text-sm text-ink-faint">None on file</span>;
  const shown = flags.slice(0, max);
  const hidden = flags.length - shown.length;

  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label="Health flags">
      {shown.map((f) => (
        <li
          key={`${f.allergy}-${f.label}`}
          className={cn(
            "inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-medium whitespace-nowrap",
            f.allergy ? "bg-danger/10 text-danger-ink" : "bg-surface text-ink-soft ring-1 ring-line ring-inset",
          )}
        >
          {f.allergy && <TriangleAlert aria-hidden className="size-3 text-danger" />}
          {f.allergy && <span className="sr-only">Allergy:</span>}
          {f.label}
        </li>
      ))}
      {hidden > 0 && (
        <li className="text-xs font-medium text-ink-faint" aria-label={`${hidden} more`}>
          +{hidden}
        </li>
      )}
    </ul>
  );
}
