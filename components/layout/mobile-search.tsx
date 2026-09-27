"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchField } from "./search-field";

/** Collapses search behind an icon on small screens; expands as a row below the bar. */
export function MobileSearch() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Close search" : "Search"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="text-ink-soft md:hidden"
      >
        {open ? <X aria-hidden /> : <Search aria-hidden />}
      </Button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-canvas px-4 py-3 md:hidden">
          <SearchField autoFocus />
        </div>
      )}
    </>
  );
}
