import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";

export function KpiOverview() {
  return (
    <KpiBand>
      <KpiTile label="Total students" value="2,450" hint="Across 15 classes" />
      <KpiTile label="Health camps" value="12" hint="3 this term" />
      <KpiTile label="Screened this year" value="1,120" hint="46% of students" />
      <KpiTile label="Reports shared" value="942" hint="With parents" />
      <KpiTile label="Pending reports" value="178" hint="Awaiting review" />
      <KpiTile label="Medical conditions" value="42" hint="Flagged students" />
    </KpiBand>
  );
}
