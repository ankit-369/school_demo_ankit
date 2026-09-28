import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link href={c.href} className="tap-target rounded-sm font-medium text-ink-soft hover:text-ink pointer-coarse:min-w-11 pointer-coarse:justify-center">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="font-medium text-ink">
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden className="size-3.5 text-ink-faint" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
