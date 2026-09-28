import { Activity, OctagonAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import { SourceBadge } from "@/components/ui/source-badge";
import type { ActionPlan, Severity } from "@/lib/data/action-plans";
import { cn } from "@/lib/utils";

const TONE: Record<Severity, { icon: LucideIcon; label: string; ring: string; text: string }> = {
  emergency: { icon: OctagonAlert, label: "Emergency", ring: "border-danger/40 bg-danger/5", text: "text-danger-ink [&_svg]:text-danger" },
  urgent: { icon: TriangleAlert, label: "Act promptly", ring: "border-warning/40 bg-warning/5", text: "text-warning-ink [&_svg]:text-warning" },
  routine: { icon: Activity, label: "Be aware", ring: "border-line bg-canvas", text: "text-ink-soft [&_svg]:text-ink-faint" },
};

type ActionPlanCardProps = { label: string; plan: ActionPlan; fromHfiles?: boolean };

export function ActionPlanCard({ label, plan, fromHfiles }: ActionPlanCardProps) {
  const tone = TONE[plan.severity];
  return (
    <article className={cn("flex flex-col gap-3 rounded-xl border p-4", tone.ring)}>
      <header className="flex flex-wrap items-center gap-2">
        <span className={cn("inline-flex items-center gap-1.5 text-[13px] font-semibold", tone.text)}>
          <tone.icon aria-hidden className="size-4" />
          {tone.label}
        </span>
        {fromHfiles && <SourceBadge source="hfiles" />}
      </header>
      <div>
        <h2 className="text-lg leading-6 font-semibold text-ink">{label}</h2>
        <p className="text-sm text-ink-soft">{plan.summary}</p>
      </div>
      {plan.signs.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-ink">Watch for</h3>
          <ul className="mt-1 list-disc pl-5 text-[15px] text-ink">
            {plan.signs.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      )}
      <div>
        <h3 className="text-sm font-medium text-ink">What to do</h3>
        <ol className="mt-1 list-decimal pl-5 text-[15px] leading-6 text-ink marker:font-semibold">
          {plan.steps.map((s) => <li key={s} className="py-0.5">{s}</li>)}
        </ol>
      </div>
    </article>
  );
}
