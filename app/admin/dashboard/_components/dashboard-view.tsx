"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChipGroup } from "@/components/ui/chip-group";
import { SectionHeading } from "@/components/ui/section-heading";
import { useAppStore } from "@/lib/store/app-store";
import { campTargetsGrade, sortCampsDesc } from "@/lib/selectors/camps";
import { dashboardKpis } from "@/lib/selectors/dashboard";
import { GRADES, gradeLabel, type Grade } from "@/lib/types/grade";
import { DashboardKpis } from "./dashboard-kpis";
import { RecentCampsTable } from "./recent-camps-table";

type GradeFilter = Grade | "all";

const CHIPS = [
  { value: "all" as GradeFilter, label: "All classes" },
  ...GRADES.map((g) => ({ value: g as GradeFilter, label: gradeLabel(g) })),
];

export function DashboardView() {
  const students = useAppStore((s) => s.students);
  const camps = useAppStore((s) => s.camps);
  const reports = useAppStore((s) => s.reports);
  const [filter, setFilter] = useState<GradeFilter>("all");
  const grade = filter === "all" ? null : filter;

  const kpis = useMemo(
    () => dashboardKpis({ students, camps, reports }, grade, new Date().getFullYear()),
    [students, camps, reports, grade],
  );
  const recent = useMemo(
    () => sortCampsDesc(grade ? camps.filter((c) => campTargetsGrade(c, grade)) : camps).slice(0, 5),
    [camps, grade],
  );

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <section className="flex flex-col gap-4" aria-label="Class filter">
        <ChipGroup label="Filter by class" chips={CHIPS} value={filter} onChange={setFilter} />
        <DashboardKpis kpis={kpis} grade={grade} />
      </section>
      <section className="flex flex-col gap-4">
        <SectionHeading
          title="Recent health camps"
          actions={
            <Link href="/admin/camps" className="rounded-sm text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          }
        />
        <RecentCampsTable camps={recent} students={students} />
      </section>
    </div>
  );
}
