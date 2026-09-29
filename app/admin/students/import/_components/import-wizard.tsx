"use client";

import Link from "next/link";
import { CircleCheck, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Stepper } from "@/components/ui/stepper";
import { pluralize } from "@/lib/format";
import { useCan } from "@/lib/hooks/use-can";
import { autoMap, type ColumnMapping } from "@/lib/import/import-fields";
import { newRowId, toDraftValues, type DraftRow } from "@/lib/import/import-row";
import { useAppStore } from "@/lib/store/app-store";
import type { NewStudentInput } from "@/lib/store/slices/students-slice";
import { MappingStep } from "./mapping-step";
import { PreviewStep } from "./preview-step";
import { UploadStep, type ParsedCsv } from "./upload-step";

const STEPS = ["Upload CSV", "Map columns", "Review & fix", "Done"];

export function ImportWizard() {
  const can = useCan("manageStudents");
  const students = useAppStore((s) => s.students);
  const importStudents = useAppStore((s) => s.importStudents);
  const [step, setStep] = useState(0);
  const [csv, setCsv] = useState<ParsedCsv>();
  const [mapping, setMapping] = useState<ColumnMapping>();
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [imported, setImported] = useState(0);

  function toReview() {
    if (!csv || !mapping) return;
    setRows(csv.rows.map((cells) => ({ id: newRowId(), values: toDraftValues(cells, mapping) })));
    setStep(2);
  }

  function doImport(inputs: NewStudentInput[]) {
    importStudents(inputs, `CSV import: ${csv?.fileName}`);
    setImported(inputs.length);
    setStep(3);
    toast.success(`Imported ${pluralize(inputs.length, "student")}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Students", href: "/admin/students" }, { label: "Import from CSV" }]} />
      <header>
        <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">Import students</h1>
        <p className="mt-1 text-[15px] text-ink-soft">Bring a class list in from a spreadsheet. Nothing is saved until you confirm.</p>
      </header>
      {!can ? (
        <EmptyState icon={Lock} title="You can't import students" description="Ask an administrator to grant “Add and edit students”." />
      ) : (
        <>
          <Stepper steps={STEPS} current={step} />
          <section className="rounded-xl border border-line bg-canvas p-5 sm:p-6" aria-label={STEPS[step]}>
            {step === 0 && (
              <UploadStep
                onParsed={(c) => {
                  setCsv(c);
                  setMapping(autoMap(c.headers));
                  setStep(1);
                }}
              />
            )}
            {step === 1 && csv && mapping && <MappingStep csv={csv} mapping={mapping} onChange={setMapping} onBack={() => setStep(0)} onNext={toReview} />}
            {step === 2 && <PreviewStep rows={rows} onChange={setRows} existingStudents={students} onBack={() => setStep(1)} onImport={doImport} />}
            {step === 3 && (
              <EmptyState
                icon={CircleCheck}
                title={`${pluralize(imported, "student")} added`}
                description="They're in the directory now. Families can connect hfiles.in from each profile."
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button asChild><Link href="/admin/students">View directory</Link></Button>
                    <Button variant="outline" onClick={() => { setCsv(undefined); setMapping(undefined); setRows([]); setStep(0); }}>Import another file</Button>
                  </div>
                }
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}
