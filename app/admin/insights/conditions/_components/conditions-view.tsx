"use client";

import { HeartPulse } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { conditionGroups } from "@/lib/selectors/insights-conditions";
import { useAppStore } from "@/lib/store/app-store";
import { parseGrade } from "@/lib/types/grade";
import { InsightHeader } from "../../_components/insight-header";
import { conditionHref } from "./condition-href";
import { ConditionStudents } from "./condition-students";
import { ConditionSwitcher } from "./condition-switcher";
import { ConditionTiles } from "./condition-tiles";

/** Filter state lives in the URL (?condition=&kind=&grade=) and updates without a server round-trip. */
export function ConditionsView() {
  const params = useSearchParams();
  const grade = parseGrade(params.get("grade"));
  const condition = params.get("condition") ?? undefined;
  const kind = params.get("kind") ?? undefined;
  const students = useAppStore((s) => s.students);
  const { allergies, conditions, total } = useMemo(() => conditionGroups(students, grade), [students, grade]);
  const all = [...allergies, ...conditions];
  const active = all.find((g) => g.label === condition && g.kind === kind);
  const flagged = new Set(all.flatMap((g) => g.students.map((s) => s.id))).size;

  return (
    <div className="flex flex-col gap-6">
      <InsightHeader
        title={active ? active.label : "Medical conditions"}
        description={
          active
            ? `${active.kind === "allergy" ? "Allergy" : "Condition"} group · tap another group or go back to all conditions.`
            : `${flagged} of ${total} active students have an allergy or condition on the school record. Tap a group to see who.`
        }
        grade={grade}
        clearGradeHref={conditionHref({ grade: null, condition: active?.label, kind: active?.kind })}
      />
      {all.length === 0 ? (
        <EmptyState icon={HeartPulse} title="No conditions on file" description="No active students in this class have an allergy or condition recorded." />
      ) : active ? (
        <>
          <ConditionSwitcher groups={all} active={active} grade={grade} />
          <ConditionStudents group={active} />
        </>
      ) : (
        <>
          <ConditionTiles title="Allergies" groups={allergies} grade={grade} />
          <ConditionTiles title="Conditions" groups={conditions} grade={grade} />
        </>
      )}
    </div>
  );
}
