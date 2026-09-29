"use client";

import { Input } from "@/components/ui/input";

type ChipSuggestInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
};

/** A comma-separated text input with quick-add suggestion chips below it. */
export function ChipSuggestInput({ id, value, onChange, suggestions, placeholder }: ChipSuggestInputProps) {
  const current = value.split(",").map((v) => v.trim().toLowerCase()).filter(Boolean);

  function addSuggestion(s: string) {
    onChange(value.trim() ? `${value.trim()}, ${s}` : s);
  }

  return (
    <div className="flex flex-col gap-2">
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      <div className="flex flex-wrap gap-1.5">
        {suggestions
          .filter((s) => !current.includes(s.toLowerCase()))
          .map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addSuggestion(s)}
              className="h-7 rounded-full border border-line px-2.5 text-xs font-medium text-ink-soft transition-colors duration-150 hover:border-primary hover:text-primary"
            >
              + {s}
            </button>
          ))}
      </div>
    </div>
  );
}
