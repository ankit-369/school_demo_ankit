"use client";

import { Lock } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Stepper } from "@/components/ui/stepper";
import { nextAcademicYear, yearLabel, type PromotionPlan } from "@/lib/academic/promotion-plan";
import { rosterByClass } from "@/lib/academic/roster";
import { useCan } from "@/lib/hooks/use-can";
import { useAppStore } from "@/lib/store/app-store";
import type { PromotionSummary } from "@/lib/store/slices/academic-slice";
import { ConfirmStep } from "./confirm-step";
import { DoneView } from "./done-view";
import { ExceptionsStep } from "./exceptions-step";
import { RosterStep } from "./roster-step";
import { TargetsStep } from "./targets-step";

const STEPS = ["Review roster", "Target grades", "Exceptions", "Confirm & archive"];

export function PromotionWizard() {
  const can = useCan("manageStudents");
  const students = useAppStore((s) => s.students);
  const staff = useAppStore((s) => s.staff);
  const year = useAppStore((s) => s.academicYear);
  const runPromotion = useAppStore((s) => s.runPromotion);
  const roster = useMemo(() => rosterByClass(students, staff), [students, staff]);
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<PromotionPlan>({ targets: {}, exceptions: {} });
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string>();
  const [summary, setSummary] = useState<PromotionSummary>();
  const toYear = nextAcademicYear(year);

  function confirm() {
    if (reason.trim().length < 3) return setReasonError("Add a short reason for the audit log");
    const result = runPromotion(plan, reason.trim());
    setSummary(result);
    toast.success(`Academic year is now ${yearLabel(result.toYear)}`);
  }

  if (!can) return <EmptyState icon={Lock} title="You can't promote students" description="Ask an administrator to grant “Add and edit students”." />;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Students", href: "/admin/students" }, { label: "Promote academic year" }]} />
      <header>
        <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">
          Promote {summary ? yearLabel(summary.fromYear) : yearLabel(year)} → {summary ? yearLabel(summary.toYear) : yearLabel(toYear)}
        </h1>
        <p className="mt-1 text-[15px] text-ink-soft">Move every class up at once, handle individual exceptions, and archive last year&apos;s health records.</p>
      </header>
      {summary ? (
        <section className="rounded-xl border border-line bg-canvas p-6"><DoneView summary={summary} /></section>
      ) : (
        <>
          <Stepper steps={STEPS} current={step} />
          <section className="rounded-xl border border-line bg-canvas p-5 sm:p-6" aria-label={STEPS[step]}>
            {step === 0 && <RosterStep roster={roster} year={yearLabel(year)} />}
            {step === 1 && <TargetsStep roster={roster} targets={plan.targets} onChange={(k, t) => setPlan((p) => ({ ...p, targets: { ...p.targets, [k]: t } }))} />}
            {step === 2 && (
              <ExceptionsStep
                roster={roster}
                plan={plan}
                onChange={(id, outcome) =>
                  setPlan((p) => {
                    const exceptions = { ...p.exceptions };
                    if (outcome) exceptions[id] = outcome;
                    else delete exceptions[id];
                    return { ...p, exceptions };
                  })
                }
              />
            )}
            {step === 3 && <ConfirmStep plan={plan} fromYear={year} toYear={toYear} reason={reason} reasonError={reasonError} onReason={(r) => { setReason(r); setReasonError(undefined); }} />}
            <div className="mt-6 flex justify-between gap-2 border-t border-line pt-4">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
              {step < 3 ? (
                <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
              ) : (
                <Button onClick={confirm}>Promote to {yearLabel(toYear)}</Button>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
