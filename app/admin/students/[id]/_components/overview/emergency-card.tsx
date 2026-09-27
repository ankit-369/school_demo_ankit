import { Phone } from "lucide-react";
import { Panel, PanelSection } from "@/components/ui/panel";
import { SourceBadge } from "@/components/ui/source-badge";
import { HealthFlags } from "@/components/students/health-flags";
import type { Student } from "@/lib/types/student";

/** What a teacher or nurse needs in the first minute of an emergency. */
export function EmergencyCard({ student: s }: { student: Student }) {
  const { school, hfiles } = s.medicalHistory;
  const hfilesOnly = hfiles.allergies.filter((a) => !school.allergies.includes(a));

  return (
    <Panel title="Emergency information">
      <PanelSection title="Allergies">
        <HealthFlags allergies={school.allergies} conditions={[]} max={10} />
        {hfilesOnly.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-soft">
            <SourceBadge source="hfiles" />
            <span>also reports {hfilesOnly.join(", ")}</span>
          </div>
        )}
      </PanelSection>
      <PanelSection title="Conditions">
        <HealthFlags allergies={[]} conditions={school.conditions} max={10} />
      </PanelSection>
      {school.notes && (
        <PanelSection title="Nurse notes">
          <p className="text-[15px] text-ink">{school.notes}</p>
        </PanelSection>
      )}
      <PanelSection title="Guardian">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[15px] text-ink">
            {s.guardian.name} <span className="text-ink-faint">· {s.guardian.relation}</span>
          </p>
          <a
            href={`tel:${s.guardian.phone.replace(/\s/g, "")}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface"
          >
            <Phone aria-hidden className="size-4 text-ink-faint" />
            {s.guardian.phone}
          </a>
        </div>
      </PanelSection>
    </Panel>
  );
}
