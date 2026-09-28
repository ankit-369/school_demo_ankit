"use client";

import { BellRing, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { GatedButton } from "@/components/ui/gated-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatDateRange, pluralize } from "@/lib/format";
import { useCan } from "@/lib/hooks/use-can";
import { completionPct, scopeLabel, type ConsentForm } from "@/lib/selectors/consent";
import { useAppStore } from "@/lib/store/app-store";
import { ConsentStudentRow } from "./consent-student-row";

export function ConsentFormCard({ form }: { form: ConsentForm }) {
  const remind = useAppStore((s) => s.remindConsent);
  const notifications = useAppStore((s) => s.notifications);
  const canNotify = useCan("notifyGuardians");
  const pct = completionPct(form);
  const pending = form.rows.filter((r) => r.record.status === "pending");
  const lastReminderFor = (id: string) => notifications.filter((n) => n.refId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]?.createdAt;

  function remindAll() {
    pending.forEach((r) => remind(r.record.id));
    toast.success(`Sent ${pluralize(pending.length, "reminder")}`, { description: "Guardians notified on WhatsApp" });
  }

  return (
    <details className="group rounded-xl border border-line bg-canvas [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none flex-col gap-3 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <ChevronDown aria-hidden className="size-4 shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-180" />
              {form.formName}
            </p>
            <p className="mt-0.5 pl-6 text-[13px] text-ink-faint">
              {form.camp ? `${form.camp.name} · ${formatDateRange(form.camp.startDate, form.camp.endDate)}` : scopeLabel(form)}
            </p>
          </div>
          <span className="tabular shrink-0 text-2xl font-semibold text-ink">{pct}%</span>
        </div>
        <ProgressBar value={form.signed} max={form.rows.length} label={`${form.formName} completion`} className="ml-6" />
        <p className="pl-6 text-[13px] text-ink-soft">{form.signed} signed, {form.pending} pending of {form.rows.length}</p>
      </summary>
      <div className="border-t border-line px-2 pb-4">
        <div className="flex justify-end px-3 pt-3">
          <GatedButton allowed={canNotify} icon={BellRing} lockedReason="Your role can't message guardians" variant="outline" size="sm" className="h-8 border-line" disabled={pending.length === 0} onClick={remindAll}>
            Remind all pending ({pending.length})
          </GatedButton>
        </div>
        <ul className="mt-2 divide-y divide-line">
          {form.rows.map((row) => (
            <ConsentStudentRow key={row.record.id} row={row} remindedAt={row.record.status === "pending" ? lastReminderFor(row.record.id) : undefined} />
          ))}
        </ul>
      </div>
    </details>
  );
}
