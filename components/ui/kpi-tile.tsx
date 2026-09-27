import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type KpiTileProps = {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  /** Quiet supporting line under the number, e.g. "of 2,450 students". */
  hint?: ReactNode;
  /** Makes the whole tile a link (subtle background shift on hover, no lift). */
  href?: string;
  className?: string;
};

/** A flat stat tile. Designed to sit inside <KpiBand>, which draws the dividers. */
export function KpiTile({ label, value, icon: Icon, hint, href, className }: KpiTileProps) {
  const body = (
    <>
      <div className="flex items-center gap-2 text-sm font-medium text-ink-soft">
        {Icon && <Icon aria-hidden className="size-4 shrink-0 text-ink-faint" />}
        <span className="truncate">{label}</span>
      </div>
      <div className="tabular text-[32px] leading-10 font-semibold tracking-tight text-ink lg:text-4xl lg:leading-[44px]">
        {value}
      </div>
      {hint && <div className="text-[13px] text-ink-faint">{hint}</div>}
    </>
  );
  const base = cn("flex min-w-0 flex-col gap-1 bg-canvas p-4 sm:p-5", className);

  if (!href) return <div className={base}>{body}</div>;
  return (
    <Link
      href={href}
      className={cn(base, "transition-colors duration-150 outline-none hover:bg-surface focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset")}
    >
      {body}
    </Link>
  );
}
