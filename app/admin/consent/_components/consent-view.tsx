"use client";

import { FileCheck } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiBand } from "@/components/ui/kpi-band";
import { KpiTile } from "@/components/ui/kpi-tile";
import { PageHeader } from "@/components/ui/page-header";
import { completionPct, consentForms } from "@/lib/selectors/consent";
import { useAppStore } from "@/lib/store/app-store";
import { ConsentFormCard } from "./consent-form-card";

export function ConsentView() {
  const consents = useAppStore((s) => s.consents);
  const students = useAppStore((s) => s.students);
  const camps = useAppStore((s) => s.camps);
  const forms = useMemo(() => consentForms(consents, students, camps), [consents, students, camps]);
  const totalSigned = forms.reduce((n, f) => n + f.signed, 0);
  const totalPending = forms.reduce((n, f) => n + f.pending, 0);
  const overallPct = completionPct({ signed: totalSigned, pending: totalPending });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Consent forms" description="Completion across the school, by form. Open a form to remind or record individual guardians." />
      <KpiBand className="grid-cols-3 md:grid-cols-3 xl:grid-cols-3">
        <KpiTile label="Forms tracked" value={forms.length} />
        <KpiTile label="Signed" value={totalSigned} hint={`${overallPct}% overall`} />
        <KpiTile label="Pending" value={totalPending} />
      </KpiBand>
      {forms.length === 0 ? (
        <EmptyState icon={FileCheck} title="No consent forms yet" description="Forms sent from a camp or student profile will appear here." />
      ) : (
        <div className="flex flex-col gap-3">
          {forms.map((f) => <ConsentFormCard key={f.key} form={f} />)}
        </div>
      )}
    </div>
  );
}
