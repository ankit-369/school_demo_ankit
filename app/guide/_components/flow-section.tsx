"use client";

import { ChevronDown } from "lucide-react";
import { FLOWS, TOTAL_FLOW_COUNT } from "@/lib/guide/flows";
import { cn } from "@/lib/utils";
import { FlowCard } from "./flow-card";

type FlowSectionProps = {
  checked: number[];
  onToggleChecked: (id: number) => void;
  showAll: boolean;
  onShowAllChange: (next: boolean) => void;
};

export function FlowSection({ checked, onToggleChecked, showAll, onShowAllChange }: FlowSectionProps) {
  const shown = showAll ? FLOWS : FLOWS.filter((f) => f.quick);

  return (
    <section aria-label="Guided flows" className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-ink">Try it yourself</h2>
        <button
          type="button"
          onClick={() => onShowAllChange(!showAll)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] font-medium text-ink-soft transition-colors duration-150 hover:bg-surface pointer-coarse:h-11"
        >
          {showAll ? "Show quick tour only" : `Show all ${TOTAL_FLOW_COUNT} flows`}
          <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-200", showAll && "rotate-180")} />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {shown.map((flow) => (
          <FlowCard key={flow.id} flow={flow} checked={checked.includes(flow.id)} onToggleChecked={() => onToggleChecked(flow.id)} />
        ))}
      </div>
    </section>
  );
}
