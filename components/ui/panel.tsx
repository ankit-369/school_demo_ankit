import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Title-row adornment, e.g. a SourceBadge. */
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  /** Heading level for the title; defaults to h2. */
  as?: "h2" | "h3";
};

/** A flat bordered section with a hairline-separated header. No shadow — dense data stays flat. */
export function Panel({
  title,
  description,
  actions,
  badge,
  children,
  className,
  headerClassName,
  bodyClassName,
  as: Heading = "h2",
}: PanelProps) {
  return (
    <section className={cn("flex min-w-0 flex-col rounded-xl border border-line bg-canvas", className)}>
      <div className={cn("flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4", headerClassName)}>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <Heading className="text-[17px] leading-6 font-semibold text-ink">{title}</Heading>
            {badge}
          </div>
          {description && <p className="text-[13px] text-ink-soft">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      <div className={cn("flex flex-col gap-5 px-5 py-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Small labelled block inside a Panel. */
export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-ink-soft">{title}</h3>
      {children}
    </div>
  );
}
