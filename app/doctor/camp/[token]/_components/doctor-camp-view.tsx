"use client";

import { ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChipGroup } from "@/components/ui/chip-group";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatDate } from "@/lib/format";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { isScreened, screeningRows } from "@/lib/selectors/screening-results";
import { useAppStore } from "@/lib/store/app-store";
import { checkDoctorLink } from "@/lib/store/slices/doctor-links-slice";
import type { ScreeningResultStatus } from "@/lib/types/screening";
import { DoctorResultRow } from "./doctor-result-row";
import { LinkError } from "./link-error";

type View = "todo" | "done" | "all";

/** Scoped entirely by the token: one camp, one screening, its roster — nothing else in the school. */
export function DoctorCampView({ token }: { token: string }) {
  const doctorLinks = useAppStore((s) => s.doctorLinks);
  const camps = useAppStore((s) => s.camps);
  const students = useAppStore((s) => s.students);
  const submit = useAppStore((s) => s.submitDoctorResult);
  const check = useMemo(() => checkDoctorLink({ doctorLinks, camps }, token), [doctorLinks, camps, token]);
  const camp = check.ok ? camps.find((c) => c.id === check.link.campId) : undefined;
  const screening = check.ok ? camp?.screenings.find((s) => s.id === check.link.screeningId) : undefined;
  const rows = useMemo(() => (screening ? screeningRows(screening, students) : []), [screening, students]);
  const [view, setView] = useState<View>("todo");
  const [openId, setOpenId] = useState<string | null>(null);

  if (!check.ok) return <LinkError reason={check.reason} />;
  if (!camp || !screening) return <LinkError reason="screening-missing" />;

  const done = rows.filter(isScreened);
  const todo = rows.filter((r) => !isScreened(r));
  const shown = view === "todo" ? todo : view === "done" ? done : rows;

  function handleSubmit(studentId: string, status: ScreeningResultStatus, notes: string) {
    const res = submit(token, { studentId, status, notes });
    if (!res.ok) return toast.error("This link can no longer save results");
    const name = rows.find((r) => r.student.id === studentId)?.student.name ?? "Student";
    toast.success(`Saved for ${name}`);
    // Open the next student still to see, so the doctor can keep going.
    const idx = todo.findIndex((r) => r.student.id === studentId);
    const next = [...todo.slice(idx + 1), ...todo.slice(0, Math.max(idx, 0))].find((r) => r.student.id !== studentId);
    setOpenId(next?.student.id ?? null);
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-[13px] font-medium text-success-ink">
          <ShieldCheck aria-hidden className="size-4 text-success" />
          Signed in by link as {check.link.doctorName}
        </p>
        <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{SCREENING_TYPE_LABELS[screening.type]}</h1>
        <p className="text-[15px] text-ink-soft">
          {camp.name} · {formatDate(screening.date)} · link valid until {formatDate(check.link.expiresAt.slice(0, 10))}
        </p>
      </header>
      <div className="flex items-center gap-3 rounded-xl bg-canvas px-4 py-3 ring-1 ring-line">
        <ProgressBar value={done.length} max={rows.length} label="Screening progress" className="h-2" />
        <span className="tabular shrink-0 text-sm font-medium text-ink">{done.length}/{rows.length} seen</span>
      </div>
      <ChipGroup label="Show" value={view} onChange={setView} chips={[{ value: "todo", label: `To see (${todo.length})` }, { value: "done", label: `Done (${done.length})` }, { value: "all", label: `All (${rows.length})` }]} />
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
        {shown.map((r) => (
          <DoctorResultRow
            key={`${r.student.id}-${r.result?.status ?? "none"}`}
            row={r}
            open={openId === r.student.id}
            onToggle={() => setOpenId((id) => (id === r.student.id ? null : r.student.id))}
            onSubmit={(status, notes) => handleSubmit(r.student.id, status, notes)}
          />
        ))}
      </ul>
      {shown.length === 0 && <p className="text-center text-sm text-ink-faint">{view === "todo" ? "Everyone has been seen. Thank you!" : "No students here yet."}</p>}
    </div>
  );
}
