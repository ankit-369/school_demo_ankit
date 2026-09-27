"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchFieldProps = {
  className?: string;
  autoFocus?: boolean;
};

export function SearchField({ className, autoFocus }: SearchFieldProps) {
  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className={cn("relative", className)}>
      <label htmlFor="global-search" className="sr-only">
        Search students by name or HFID
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint"
      />
      <input
        id="global-search"
        type="search"
        autoFocus={autoFocus}
        placeholder="Search students by name or HFID"
        className="h-10 w-full rounded-lg border border-line bg-surface pr-3 pl-9 text-sm text-ink transition-colors duration-150 placeholder:text-ink-faint hover:bg-canvas focus:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary"
      />
    </form>
  );
}
