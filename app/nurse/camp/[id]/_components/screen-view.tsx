"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, UserX } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { HealthFlags } from "@/components/students/health-flags";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { nextToScreen, screenHref, stationHref } from "@/lib/selectors/camp-day";
import { isScreened } from "@/lib/selectors/screening-results";
import { useAppStore } from "@/lib/store/app-store";
import { ResultForm } from "./result-form";
import type { CampDayChoice } from "./status-picker";
import { useCampDay } from "./use-camp-day";

type ScreenViewProps = { campId: string; studentId: string; stationId?: string };

export function ScreenView({ campId, studentId, stationId }: ScreenViewProps) {
  const router = useRouter();
  const record = useAppStore((s) => s.recordScreeningResult);
  const logAudit = useAppStore((s) => s.logAudit);
  const { camp, station, rows } = useCampDay(campId, stationId);
  const row = rows.find((r) => r.student.id === studentId);
  const next = nextToScreen(rows, studentId);
  const nextHref = camp && station && next ? screenHref(camp.id, next.student.id, station.id) : null;
  const doneCount = rows.filter(isScreened).length;

  // Warm the next student's page so "Save & next" is instant.
  useEffect(() => {
    if (nextHref) router.prefetch(nextHref);
  }, [nextHref, router]);

  if (!camp || !station || !row) {
    return <EmptyState icon={UserX} title="Not on this roster" description="This student isn't part of this station." action={<Link href="/nurse" className="text-sm font-medium text-primary">All camps</Link>} />;
  }

  const summaryHref = stationHref(camp.id, "summary", station.id);
  const go = () => router.push(nextHref ?? summaryHref);

  function save(choice: CampDayChoice, notes: string) {
    const status = choice === "absent" ? "pending" : choice;
    record(camp!.id, station!.id, {
      studentId,
      status,
      notes,
      ...(status !== "pending" && { reportUrl: `/reports/${station!.id}/${studentId}.pdf` }),
    });
    logAudit("camp.result-recorded", row!.student.name, `Camp-day mode · ${choice}`);
    toast.success(`${row!.student.name.split(" ")[0]}: ${choice === "follow-up" ? "follow-up" : choice}`, { duration: 1500 });
    if (!nextHref) toast.success("Station complete — nice work", { duration: 3000 });
    go();
  }

  const s = row.student;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <Link href={stationHref(camp.id, "roster", station.id)} className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-ink-soft hover:text-ink">
          <ChevronLeft aria-hidden className="size-4" />
          Roster
        </Link>
        <span className="tabular text-sm text-ink-soft">
          {SCREENING_TYPE_LABELS[station.type]} · {doneCount}/{rows.length} done
        </span>
      </div>
      <section aria-label="Student" className="flex items-center gap-4 rounded-xl border border-line bg-canvas p-4">
        <StudentAvatar name={s.name} photoUrl={s.photoUrl} size="lg" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="text-xl leading-7 font-semibold text-ink">{s.name}</h1>
          <p className="text-sm text-ink-soft">
            {row.classKey} · Roll {s.rollNumber} · {s.hfid}
          </p>
          <HealthFlags allergies={s.medicalHistory.school.allergies} conditions={s.medicalHistory.school.conditions} max={4} />
        </div>
      </section>
      <ResultForm key={studentId} type={station.type} existing={row.result} nextName={next?.student.name ?? null} onSave={save} onSkip={go} />
    </div>
  );
}
