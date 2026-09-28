"use client";

import { ShallowLink } from "@/components/ui/shallow-link";
import { ArrowLeft } from "lucide-react";
import type { ConditionGroup } from "@/lib/selectors/insights-conditions";
import type { Grade } from "@/lib/types/grade";
import { cn } from "@/lib/utils";
import { conditionHref } from "./condition-href";

type ConditionSwitcherProps = { groups: ConditionGroup[]; active: ConditionGroup; grade: Grade | null };

/** Compact row once a group is open: jump back to all groups, or straight to another. */
export function ConditionSwitcher({ groups, active, grade }: ConditionSwitcherProps) {
  return (
    <nav aria-label="Condition groups" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:flex-wrap">
      <ShallowLink
        href={conditionHref({ grade })}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface pointer-coarse:h-11"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All conditions
      </ShallowLink>
      {groups.map((g) => {
        const on = g.label === active.label && g.kind === active.kind;
        return (
          <ShallowLink
            key={`${g.kind}-${g.label}`}
            href={conditionHref({ grade, condition: g.label, kind: g.kind })}
            aria-current={on ? "page" : undefined}
            className={cn(
              "inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 pointer-coarse:h-11",
              on ? "border-primary bg-primary text-white" : "border-line text-ink-soft hover:text-ink",
            )}
          >
            {g.label} ({g.students.length})
          </ShallowLink>
        );
      })}
    </nav>
  );
}
