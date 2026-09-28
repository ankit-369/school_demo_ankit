import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";
import type { DashboardKpis as Kpis } from "@/lib/selectors/dashboard";
import { gradeLabel, type Grade } from "@/lib/types/grade";

type DashboardKpisProps = {
  kpis: Kpis;
  grade: Grade | null;
};

const nf = new Intl.NumberFormat("en-IN");

/** Each tile links to its drill-down (built in Phase 4), carrying the class filter along. */
export function DashboardKpis({ kpis, grade }: DashboardKpisProps) {
  const href = (metric: string) => `/admin/insights/${metric}${grade ? `?grade=${grade}` : ""}`;
  const scope = grade ? gradeLabel(grade) : "Whole school";

  return (
    <KpiBand>
      <KpiTile href={href("students")} label="Total students" value={nf.format(kpis.totalStudents)} hint={scope} />
      <KpiTile href={href("camps")} label="Health camps" value={nf.format(kpis.totalCamps)} hint="All time" />
      <KpiTile href={href("screened")} label="Screened this year" value={nf.format(kpis.screenedThisYear)} hint="Distinct students" />
      <KpiTile href={href("reports-shared")} label="Reports shared" value={nf.format(kpis.reportsShared)} hint="Via hfiles.in" />
      <KpiTile href={href("pending-reports")} label="Pending reports" value={nf.format(kpis.pendingReports)} hint="Results or uploads outstanding" />
      <KpiTile href={href("conditions")} label="Medical conditions" value={nf.format(kpis.medicalConditions)} hint="Students with a flag" />
    </KpiBand>
  );
}
