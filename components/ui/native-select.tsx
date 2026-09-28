import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

type NativeSelectProps = ComponentProps<"select"> & {
  options: SelectOption[];
  /** Adds a leading empty option, e.g. "All classes". */
  placeholder?: string;
};

/** Native <select>: accessible and uses the OS picker on phones. */
export function NativeSelect({ options, placeholder, className, ...props }: NativeSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        {...props}
        className="h-10 w-full appearance-none pointer-coarse:h-11 pointer-coarse:text-base rounded-lg border border-input bg-canvas pr-9 pl-3 text-sm text-ink transition-colors duration-150 outline-none hover:border-ink-faint/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-danger"
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-faint"
      />
    </div>
  );
}
