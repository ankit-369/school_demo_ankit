import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";
import { HEARING_LABELS } from "@/lib/labels";
import type { Student } from "@/lib/types/student";

export function VitalsBand({ student: s }: { student: Student }) {
  return (
    <KpiBand>
      <KpiTile label="Height" value={s.heightCm} hint="cm" />
      <KpiTile label="Weight" value={s.weightKg} hint="kg" />
      <KpiTile label="BMI" value={s.bmi.toFixed(1)} hint="kg/m²" />
      <KpiTile label="Vision" value={s.vision} hint={s.vision === "6/6" ? "Normal" : "Below 6/6"} />
      <KpiTile label="Hearing" value={<span className="text-2xl lg:text-[28px]">{HEARING_LABELS[s.hearing]}</span>} hint="Last screening" />
      <KpiTile label="Blood group" value={s.bloodGroup} hint="On file" />
    </KpiBand>
  );
}
