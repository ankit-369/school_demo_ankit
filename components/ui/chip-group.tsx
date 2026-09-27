"use client";

import { cn } from "@/lib/utils";

export type Chip<V extends string> = { value: V; label: string };

type ChipGroupProps<V extends string> = {
  label: string;
  chips: Chip<V>[];
  value: V;
  onChange: (value: V) => void;
  className?: string;
};

/** Single-select toggle chips; scrolls horizontally on narrow screens. */
export function ChipGroup<V extends string>({ label, chips, value, onChange, className }: ChipGroupProps<V>) {
  return (
    <div role="group" aria-label={label} className={cn("-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible", className)}>
      {chips.map((chip) => {
        const active = chip.value === value;
        return (
          <button
            key={chip.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(chip.value)}
            className={cn(
              "h-9 shrink-0 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150 pointer-coarse:h-11",
              active
                ? "border-primary bg-primary text-white"
                : "border-line bg-canvas text-ink-soft hover:border-ink-faint/60 hover:text-ink",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
