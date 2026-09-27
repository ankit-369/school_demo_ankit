"use client";

import { Stethoscope } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";
import { useAppStore } from "@/lib/store/app-store";
import { studentScreenings, type StudentScreeningRow } from "@/lib/selectors/students";
import { useCurrentStudent } from "../student-context";
import { CampHistoryGroup } from "./camp-history-group";

export function CampHistoryTab() {
  const student = useCurrentStudent();
  const camps = useAppStore((s) => s.camps);
  const rows = useMemo(() => studentScreenings(student, camps), [student, camps]);

  /** Preserve newest-first order while grouping by camp. */
  const groups = useMemo(() => {
    const map = new Map<string, StudentScreeningRow[]>();
    rows.forEach((r) => map.set(r.camp.id, [...(map.get(r.camp.id) ?? []), r]));
    return [...map.values()];
  }, [rows]);

  const screened = rows.filter((r) => r.result && r.result.status !== "pending");
  const followUps = rows.filter((r) => r.result?.status === "follow-up").length;
  const attended = new Set(screened.map((r) => r.camp.id)).size;

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Stethoscope}
        title="No camp history yet"
        description="Screenings will appear here once this student's class is included in a health camp."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <KpiBand className="grid-cols-3 md:grid-cols-3 xl:grid-cols-3">
        <KpiTile label="Screenings done" value={screened.length} />
        <KpiTile label="Active follow-ups" value={followUps} hint={followUps ? "Needs attention" : "None open"} />
        <KpiTile label="Camps attended" value={attended} />
      </KpiBand>
      {groups.map((g) => (
        <CampHistoryGroup key={g[0].camp.id} camp={g[0].camp} rows={g} studentName={student.name} />
      ))}
    </div>
  );
}
