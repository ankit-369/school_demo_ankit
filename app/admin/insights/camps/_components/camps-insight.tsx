"use client";

import { CalendarX } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { campTargetsGrade, sortCampsDesc } from "@/lib/selectors/camps";
import { useAppStore } from "@/lib/store/app-store";
import type { Grade } from "@/lib/types/grade";
import { CampCard } from "../../../camps/_components/camp-card";

/** All camps (no tab split), reusing the camp cards from /admin/camps. */
export function CampsInsight({ grade }: { grade: Grade | null }) {
  const camps = useAppStore((s) => s.camps);
  const students = useAppStore((s) => s.students);
  const list = useMemo(() => sortCampsDesc(grade ? camps.filter((c) => campTargetsGrade(c, grade)) : camps), [camps, grade]);

  if (list.length === 0) {
    return <EmptyState icon={CalendarX} title="No camps for this class" description="Remove the class filter to see every camp." />;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {list.map((c) => (
        <CampCard key={c.id} camp={c} students={students} />
      ))}
    </div>
  );
}
