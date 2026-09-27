"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ToggleChipsProps<V extends string> = {
  label: string;
  options: { value: V; label: string }[];
  value: V[];
  onChange: (next: V[]) => void;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
};

/** Multi-select chips (e.g. target standards). Selected chips show a check, not just colour. */
export function ToggleChips<V extends string>({ label, options, value, onChange, invalid, describedBy, className }: ToggleChipsProps<V>) {
  const toggle = (v: V) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div role="group" aria-label={label} aria-describedby={describedBy} className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(o.value)}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[13px] font-medium transition-colors duration-150 pointer-coarse:h-11",
              on ? "border-primary bg-primary/5 text-primary" : "border-line text-ink-soft hover:border-ink-faint/60 hover:text-ink",
              invalid && !on && "border-danger/40",
            )}
          >
            {on && <Check aria-hidden className="size-3.5" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
