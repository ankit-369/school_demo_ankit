"use client";

import { yearLabel } from "@/lib/academic/promotion-plan";
import { useAppStore } from "@/lib/store/app-store";

export function AcademicYearBadge() {
  const year = useAppStore((s) => s.academicYear);
  return (
    <span className="hidden h-6 shrink-0 items-center rounded-md bg-surface px-2 text-xs font-medium text-ink-soft ring-1 ring-line ring-inset sm:inline-flex" title="Current academic year">
      {yearLabel(year)}
    </span>
  );
}
