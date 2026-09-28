"use client";

import Link from "next/link";
import { ChevronLeft, NotebookPen, ShieldCheck, UserX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { actionPlanFor, SEVERITY_ORDER } from "@/lib/data/action-plans";
import { ROLE_STAFF_IDS } from "@/lib/data/personas";
import { useAppStore } from "@/lib/store/app-store";
import { classKey } from "@/lib/types/grade";
import { ActionPlanCard } from "./action-plan-card";
import { CallButtons } from "./call-buttons";
import { useMyClass } from "./use-my-class";

export function StudentAlert({ studentId }: { studentId: string }) {
  const { students } = useMyClass();
  const nurse = useAppStore((s) => s.staff.find((st) => st.id === ROLE_STAFF_IDS.nurse));
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return <EmptyState icon={UserX} title="Not in your class" description="You can only see action cards for your own students." action={<Link href="/teacher/class" className="text-sm font-medium text-primary">Back to my class</Link>} />;
  }

  const { school, hfiles } = student.medicalHistory;
  const items = [
    ...school.allergies.map((label) => ({ label, fromHfiles: false })),
    ...school.conditions.map((label) => ({ label, fromHfiles: false })),
    ...hfiles.allergies.filter((a) => !school.allergies.includes(a)).map((label) => ({ label, fromHfiles: true })),
  ]
    .map((i) => ({ ...i, plan: actionPlanFor(i.label) }))
    .sort((a, b) => SEVERITY_ORDER[a.plan.severity] - SEVERITY_ORDER[b.plan.severity]);
  const emergency = items.some((i) => i.plan.severity === "emergency");

  return (
    <div className="flex flex-col gap-5">
      <Link href="/teacher/class" className="inline-flex w-fit items-center gap-1 rounded-sm text-sm font-medium text-ink-soft hover:text-ink">
        <ChevronLeft aria-hidden className="size-4" />
        My class
      </Link>
      <header className="flex items-center gap-4">
        <StudentAvatar name={student.name} photoUrl={student.photoUrl} size="lg" />
        <div>
          <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{student.name}</h1>
          <p className="text-[15px] text-ink-soft">{classKey(student.grade, student.division)} · Roll {student.rollNumber} · Blood {student.bloodGroup}</p>
        </div>
      </header>
      <CallButtons student={student} nurse={nurse} showAmbulance={emergency} />
      {school.notes && (
        <p className="rounded-xl bg-canvas px-4 py-3 text-[15px] text-ink ring-1 ring-line">
          <span className="block text-sm font-medium text-ink-soft">From the school nurse</span>
          {school.notes}
        </p>
      )}
      {items.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No health alerts on file" description="Nothing special to watch for. If they feel unwell, send them to the nurse." className="rounded-xl bg-canvas ring-1 ring-line" />
      ) : (
        items.map((i) => <ActionPlanCard key={`${i.fromHfiles}-${i.label}`} label={i.label} plan={i.plan} fromHfiles={i.fromHfiles} />)
      )}
      <Link href={`/teacher/incident/new?student=${student.id}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-canvas text-[15px] font-semibold text-ink transition-colors duration-150 hover:bg-surface">
        <NotebookPen aria-hidden className="size-4" />
        Log an incident for {student.name.split(" ")[0]}
      </Link>
    </div>
  );
}
