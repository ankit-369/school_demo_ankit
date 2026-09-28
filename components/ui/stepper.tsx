import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StepperProps = { steps: string[]; current: number; className?: string };

/** Wizard progress. Completed steps show a check; the current step is announced as such. */
export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn("flex items-center gap-2 overflow-x-auto [scrollbar-width:none] sm:gap-3", className)} aria-label="Progress">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} aria-current={active ? "step" : undefined} className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-[13px] font-semibold transition-colors duration-200",
                done ? "bg-primary text-white" : active ? "border-2 border-primary text-primary" : "border border-line text-ink-faint",
              )}
            >
              {done ? <Check aria-hidden className="size-4" /> : i + 1}
              {done && <span className="sr-only">Completed:</span>}
            </span>
            <span className={cn("text-sm font-medium whitespace-nowrap", active ? "text-ink" : "text-ink-faint", !active && "hidden sm:inline")}>{label}</span>
            {i < steps.length - 1 && <span aria-hidden className={cn("h-px w-6 sm:w-10", done ? "bg-primary" : "bg-line")} />}
          </li>
        );
      })}
    </ol>
  );
}
