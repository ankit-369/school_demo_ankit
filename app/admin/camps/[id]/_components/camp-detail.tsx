"use client";

import Link from "next/link";
import { CalendarX, Smartphone } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateRange } from "@/lib/format";
import { CAMP_PHASE } from "@/lib/labels";
import { useAppStore } from "@/lib/store/app-store";
import { campDoctors, campPhase, campProgress, campStandards, standardsLabel } from "@/lib/selectors/camps";
import { AddScreeningDialog } from "./add-screening-dialog";
import { ScreeningsList } from "./screenings-list";

export function CampDetail({ id }: { id: string }) {
  const camp = useAppStore((s) => s.camps.find((c) => c.id === id));
  const students = useAppStore((s) => s.students);

  if (!camp) {
    return (
      <EmptyState
        icon={CalendarX}
        title="Camp not found"
        description="It may have been removed, or the demo data was reset."
        action={<Button asChild variant="outline"><Link href="/admin/camps">Back to camps</Link></Button>}
      />
    );
  }

  const { done, expected } = campProgress(camp, students);
  const results = camp.screenings.flatMap((s) => s.results);
  const followUps = results.filter((r) => r.status === "follow-up").length;
  const reports = results.filter((r) => r.reportUrl).length;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Health camps", href: "/admin/camps" }, { label: camp.name }]} />
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{camp.name}</h1>
            <StatusBadge {...CAMP_PHASE[campPhase(camp)]} />
          </div>
          <p className="text-[15px] text-ink-soft">
            {formatDateRange(camp.startDate, camp.endDate)} · Classes {standardsLabel(campStandards(camp))} · {campDoctors(camp).join(", ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="border-line">
            <Link href={`/nurse/camp/${camp.id}/roster`}>
              <Smartphone aria-hidden />
              Open camp-day mode
            </Link>
          </Button>
          <AddScreeningDialog camp={camp} />
        </div>
      </header>
      <KpiBand className="md:grid-cols-4 xl:grid-cols-4">
        <KpiTile label="Screenings" value={camp.screenings.length} />
        <KpiTile label="Checks done" value={done} hint={`of ${expected} expected`} />
        <KpiTile label="Follow-ups" value={followUps} hint={followUps ? "Need parent contact" : "None raised"} />
        <KpiTile label="Reports issued" value={reports} />
      </KpiBand>
      <ScreeningsList camp={camp} students={students} />
    </div>
  );
}
