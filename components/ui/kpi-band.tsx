import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type KpiBandProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A single flat row of KpiTiles separated by hairlines. The 1px gap over a
 * line-coloured background draws dividers that survive any wrap.
 */
export function KpiBand({ children, className }: KpiBandProps) {
  return (
    <section
      aria-label="Key figures"
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3 xl:grid-cols-6",
        className,
      )}
    >
      {children}
    </section>
  );
}
