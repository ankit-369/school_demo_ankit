"use client";

import { ChevronDown, Lightbulb } from "lucide-react";
import { useState } from "react";
import type { Flow } from "@/lib/guide/flows";
import { cn } from "@/lib/utils";
import { FlowSteps } from "./flow-steps";
import { RoleChip } from "./role-chip";

type FlowCardProps = { flow: Flow; checked: boolean; onToggleChecked: () => void };

export function FlowCard({ flow, checked, onToggleChecked }: FlowCardProps) {
  const [expanded, setExpanded] = useState(false);
  const panelId = `flow-panel-${flow.id}`;

  return (
    <article id={`flow-${flow.id}`} className="scroll-mt-6 rounded-xl border border-line bg-canvas transition-shadow duration-150">
      <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-surface text-[12px] font-semibold text-ink-soft">
            {flow.id}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-semibold text-ink">{flow.title}</span>
              <RoleChip roles={flow.roles} />
            </span>
            <span className="mt-0.5 block text-[13px] text-ink-soft">{flow.benefit}</span>
          </span>
          <ChevronDown aria-hidden className={cn("mt-1 size-4 shrink-0 text-ink-faint transition-transform duration-200", expanded && "rotate-180")} />
        </button>
        <label className="mt-0.5 flex shrink-0 cursor-pointer items-center gap-1.5 pointer-coarse:min-h-11 text-[13px] font-medium text-ink-soft">
          <input type="checkbox" checked={checked} onChange={onToggleChecked} className="size-4" />
          Checked
        </label>
      </div>
      {expanded && (
        <div id={panelId} className="flex flex-col gap-4 border-t border-line px-4 py-4 sm:px-5">
          <p className="text-[14px] text-ink-soft">
            <span className="font-medium text-ink">Why it matters. </span>
            {flow.why}
          </p>
          <div className="flex flex-col gap-2">
            <h3 className="text-[13px] font-medium text-ink-soft">Try it</h3>
            <FlowSteps steps={flow.steps} />
          </div>
          <div className="rounded-lg bg-primary/5 px-4 py-3">
            <p className="text-[13px] font-medium text-primary">You should see</p>
            <p className="mt-0.5 text-[14px] text-ink">{flow.result}</p>
          </div>
          {flow.goodToKnow && (
            <p className="flex items-start gap-2 text-[13px] text-ink-faint">
              <Lightbulb aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              {flow.goodToKnow}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
