import { ArrowDown } from "lucide-react";
import { GuideLink } from "@/components/layout/guide-link";
import type { GuideStep } from "@/lib/guide/flows";

/** A vertical numbered stepper — each step can carry a "Go" button that jumps straight to the screen. */
export function FlowSteps({ steps }: { steps: GuideStep[] }) {
  return (
    <ol className="flex flex-col gap-1">
      {steps.map((step, i) => (
        <li key={step.text} className="flex flex-col items-start gap-1">
          <div className="flex w-full items-center gap-3 rounded-lg bg-surface px-3 py-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-canvas text-[11px] font-semibold text-ink-soft ring-1 ring-line">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 text-[14px] text-ink">{step.text}</span>
            {step.go && (
              <GuideLink role={step.go.role} href={step.go.href} className="shrink-0">
                {step.go.label}
              </GuideLink>
            )}
          </div>
          {i < steps.length - 1 && <ArrowDown aria-hidden className="ml-3.5 size-3.5 text-ink-faint" />}
        </li>
      ))}
    </ol>
  );
}
