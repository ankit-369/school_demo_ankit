"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { RoleChip } from "./role-chip";
import { STAGES } from "@/lib/guide/flows";

function scrollToFlow(flowId: number) {
  const el = document.getElementById(`flow-${flowId}`);
  if (!el) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  el.classList.add("ring-2", "ring-primary");
  window.setTimeout(() => el.classList.remove("ring-2", "ring-primary"), reduceMotion ? 10 : 1200);
}

type GuideDiagramProps = {
  /** Called before scrolling, so the caller can reveal all flows if the target is currently hidden behind "quick tour only". */
  onNavigate: () => void;
};

/** The 6-stage journey: horizontal with arrows on desktop, a vertical column on mobile. */
export function GuideDiagram({ onNavigate }: GuideDiagramProps) {
  function goToStage(flowId: number) {
    onNavigate();
    // Let the (possibly newly revealed) card mount before measuring it.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToFlow(flowId)));
  }

  return (
    <section aria-label="How it fits together" className="px-4 py-8">
      <h2 className="mb-5 text-center text-xl font-semibold text-ink">The big picture</h2>
      <ol className="mx-auto flex max-w-5xl flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-1.5">
        {STAGES.map((stage, i) => (
          <li key={stage.id} className="flex flex-col items-center gap-1 sm:flex-row sm:gap-1.5">
            <button
              type="button"
              onClick={() => goToStage(stage.flowId)}
              className="flex w-28 flex-col items-center gap-1.5 rounded-xl border border-line bg-canvas px-2 py-3 text-center transition-colors duration-150 hover:border-primary/40 hover:bg-surface"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <stage.icon aria-hidden className="size-[18px]" />
              </span>
              <span className="text-[13px] leading-tight font-medium text-ink">{stage.label}</span>
              <RoleChip roles={[stage.role]} />
            </button>
            {i < STAGES.length - 1 && (
              <>
                <ArrowDown aria-hidden className="size-4 shrink-0 text-ink-faint sm:hidden" />
                <ArrowRight aria-hidden className="hidden size-4 shrink-0 text-ink-faint sm:block" />
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
