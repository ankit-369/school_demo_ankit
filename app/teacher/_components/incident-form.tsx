"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Lock } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCan } from "@/lib/hooks/use-can";
import { useAppStore } from "@/lib/store/app-store";
import { classKey } from "@/lib/types/grade";
import { composeIncidentNote, INCIDENT_KINDS, incidentSchema, type IncidentValues } from "./incident-schema";
import { useMyClass } from "./use-my-class";

/** Writes through the same addClinicalNote action as the nurse's form — it lands in the student's Notes tab. */
export function IncidentForm({ presetStudentId }: { presetStudentId?: string }) {
  const { students } = useMyClass();
  const addNote = useAppStore((s) => s.addClinicalNote);
  const can = useCan("logIncidents");
  const router = useRouter();
  const preset = students.some((s) => s.id === presetStudentId) ? presetStudentId : "";
  const form = useForm<IncidentValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: { studentId: preset, details: "", actionTaken: "", nurseFollowUp: true },
  });
  const e = form.formState.errors;

  if (!can) return <EmptyState icon={Lock} title="You can't log incidents" description="Ask an administrator to grant “Log classroom incidents”." />;

  const onSubmit = form.handleSubmit((v) => {
    addNote({ studentId: v.studentId, type: "incident", urgent: v.nurseFollowUp, notes: composeIncidentNote(v) });
    const name = students.find((s) => s.id === v.studentId)?.name ?? "the student";
    toast.success(`Incident logged for ${name}`, { description: v.nurseFollowUp ? "The nurse will see it flagged as urgent." : "Saved to their notes." });
    router.push(`/teacher/class/${v.studentId}/alert`);
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      <Link href="/teacher/class" className="inline-flex w-fit items-center gap-1 rounded-sm text-sm font-medium text-ink-soft hover:text-ink pointer-coarse:min-h-11">
        <ChevronLeft aria-hidden className="size-4" />
        My class
      </Link>
      <header>
        <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">Log an incident</h1>
        <p className="mt-1 text-[15px] text-ink-soft">Goes straight to the student&apos;s notes for the school nurse.</p>
      </header>
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-canvas p-4">
        <FormField label="Student" htmlFor="inc-student" error={e.studentId?.message}>
          <NativeSelect {...fieldA11y("inc-student", e.studentId?.message)} placeholder="Choose…" options={students.map((s) => ({ value: s.id, label: `${s.name} · ${classKey(s.grade, s.division)}` }))} {...form.register("studentId")} />
        </FormField>
        <FormField label="What happened" htmlFor="inc-kind" error={e.kind?.message}>
          <NativeSelect {...fieldA11y("inc-kind", e.kind?.message)} placeholder="Choose…" options={INCIDENT_KINDS.map((k) => ({ value: k.value, label: k.label }))} {...form.register("kind")} />
        </FormField>
        <FormField label="Details" htmlFor="inc-details" error={e.details?.message}>
          <Textarea {...fieldA11y("inc-details", e.details?.message)} rows={3} placeholder="e.g. Tripped on the stairs after lunch, grazed left knee" className="text-[16px]" {...form.register("details")} />
        </FormField>
        <FormField label="What you did" htmlFor="inc-action" error={e.actionTaken?.message}>
          <Input {...fieldA11y("inc-action", e.actionTaken?.message)} placeholder="e.g. Cleaned it, sent to the medical room" className="text-[16px]" {...form.register("actionTaken")} />
        </FormField>
        <Controller
          control={form.control}
          name="nurseFollowUp"
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4 rounded-lg bg-surface px-4 py-3">
              <label htmlFor="inc-urgent" className="flex flex-col">
                <span className="text-sm font-medium text-ink">Ask the nurse to follow up</span>
                <span className="text-[13px] text-ink-faint">Flags the note as urgent</span>
              </label>
              <Switch id="inc-urgent" checked={field.value} onCheckedChange={field.onChange} />
            </div>
          )}
        />
      </div>
      <button type="submit" className="h-14 rounded-xl bg-primary text-[16px] font-semibold text-white transition-colors duration-150 hover:bg-primary/90">
        Save incident
      </button>
    </form>
  );
}
