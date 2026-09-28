"use client";

import { ShallowLink } from "@/components/ui/shallow-link";
import { Activity, TriangleAlert } from "lucide-react";
import type { ConditionGroup } from "@/lib/selectors/insights-conditions";
import type { Grade } from "@/lib/types/grade";
import { cn } from "@/lib/utils";
import { conditionHref } from "./condition-href";

type ConditionTilesProps = { title: string; groups: ConditionGroup[]; grade: Grade | null };

/** Tappable groups — the count is the hero; allergies carry a warning icon, never colour alone. */
export function ConditionTiles({ title, groups, grade }: ConditionTilesProps) {
  if (groups.length === 0) return null;
  return (
    <section className="flex flex-col gap-3" aria-label={title}>
      <h2 className="text-lg leading-7 font-semibold text-ink">{title}</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {groups.map((g) => {
          const Icon = g.kind === "allergy" ? TriangleAlert : Activity;
          return (
            <li key={g.label}>
              <ShallowLink
                href={conditionHref({ grade, condition: g.label, kind: g.kind })}
                className="flex h-full flex-col gap-2 rounded-xl border border-line bg-canvas p-4 transition-colors duration-150 hover:bg-surface"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                  <Icon aria-hidden className={cn("size-4 shrink-0", g.kind === "allergy" ? "text-danger" : "text-ink-faint")} />
                  <span className="truncate">{g.label}</span>
                </span>
                <span className="tabular text-[32px] leading-10 font-semibold tracking-tight text-ink">
                  {g.students.length}
                  <span className="sr-only"> {g.students.length === 1 ? "student" : "students"}</span>
                </span>
                {g.hfilesOnly.length > 0 && (
                  <span className="text-[13px] font-medium text-synced-ink">+{g.hfilesOnly.length} via hfiles.in only</span>
                )}
              </ShallowLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
