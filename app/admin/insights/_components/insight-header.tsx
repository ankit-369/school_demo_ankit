import Link from "next/link";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { gradeLabel, type Grade } from "@/lib/types/grade";

type InsightHeaderProps = {
  title: string;
  description: ReactNode;
  grade: Grade | null;
  /** Where the "remove class filter" chip links to. */
  clearGradeHref: string;
  actions?: ReactNode;
};

/** Shared header for dashboard drill-downs: breadcrumb back, title, and the class scope chip. */
export function InsightHeader({ title, description, grade, clearGradeHref, actions }: InsightHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: title }]} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{title}</h1>
            {grade && (
              <Link
                href={clearGradeHref}
                className="inline-flex h-7 items-center gap-1.5 rounded-full border border-line bg-surface pr-2 pl-3 text-[13px] font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
                aria-label={`Remove ${gradeLabel(grade)} filter`}
              >
                {gradeLabel(grade)}
                <X aria-hidden className="size-3.5" />
              </Link>
            )}
          </div>
          <p className="mt-1 text-[15px] text-ink-soft">{description}</p>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}
