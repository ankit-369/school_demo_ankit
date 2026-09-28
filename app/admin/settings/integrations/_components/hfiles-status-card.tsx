import { CheckCircle2, Link2 } from "lucide-react";
import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";
import { Panel } from "@/components/ui/panel";

export function HfilesStatusCard({ total, connected }: { total: number; connected: number }) {
  const pct = total === 0 ? 0 : Math.round((connected / total) * 100);
  return (
    <Panel
      className="border-synced/40"
      headerClassName="rounded-t-xl border-synced/20 bg-synced/5"
      title={
        <span className="inline-flex items-center gap-2 text-synced-ink">
          <Link2 aria-hidden className="size-[18px] text-synced" />
          hfiles.in
        </span>
      }
      description="Family health records, synced automatically."
      badge={
        <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-synced/10 px-2.5 text-xs font-medium text-synced-ink">
          <CheckCircle2 aria-hidden className="size-3.5" />
          Connected
        </span>
      }
    >
      <KpiBand className="grid-cols-3 md:grid-cols-3 xl:grid-cols-3">
        <KpiTile label="Students connected" value={connected} hint={`of ${total} active`} />
        <KpiTile label="Connection rate" value={`${pct}%`} />
        <KpiTile label="Sync direction" value={<span className="text-[22px] lg:text-2xl">Two-way</span>} hint="Reports and results shared" />
      </KpiBand>
    </Panel>
  );
}
