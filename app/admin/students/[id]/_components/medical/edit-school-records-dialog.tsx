"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store/app-store";
import type { Student } from "@/lib/types/student";
import { splitList } from "../../../_components/add-student/add-student-schema";

const schema = z.object({
  allergies: z.string(),
  conditions: z.string(),
  notes: z.string(),
  reason: z.string().trim().min(3, "Say briefly why this changed — it goes in the audit log"),
});
type Values = z.infer<typeof schema>;

const FORM_ID = "edit-school-records";

export function EditSchoolRecordsDialog({ student }: { student: Student }) {
  const [open, setOpen] = useState(false);
  const update = useAppStore((s) => s.updateSchoolMedicalHistory);
  const { school } = student.medicalHistory;
  const defaults = (): Values => ({
    allergies: school.allergies.join(", "),
    conditions: school.conditions.join(", "),
    notes: school.notes,
    reason: "",
  });
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults() });
  const e = form.formState.errors;

  function onOpenChange(next: boolean) {
    if (next) form.reset(defaults());
    setOpen(next);
  }

  const onSubmit = form.handleSubmit((v) => {
    update(student.id, { allergies: splitList(v.allergies), conditions: splitList(v.conditions), notes: v.notes.trim() }, v.reason);
    setOpen(false);
    toast.success("School records updated");
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit school records"
      description="Only the school's own entries change. hfiles.in data is managed by the family."
      trigger={
        <Button variant="outline" size="sm" className="h-9 border-line">
          <Pencil aria-hidden />
          Edit
        </Button>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form={FORM_ID}>Save changes</Button>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField label="Allergies" htmlFor="esr-allergies" hint="Separate with commas">
          <Input id="esr-allergies" {...form.register("allergies")} />
        </FormField>
        <FormField label="Conditions" htmlFor="esr-conditions" hint="Separate with commas">
          <Input id="esr-conditions" {...form.register("conditions")} />
        </FormField>
        <FormField label="Nurse notes" htmlFor="esr-notes">
          <Textarea id="esr-notes" rows={3} {...form.register("notes")} />
        </FormField>
        <FormField label="Reason for change" htmlFor="esr-reason" error={e.reason?.message}>
          <Input {...fieldA11y("esr-reason", e.reason?.message)} placeholder="e.g. Updated after parent meeting" {...form.register("reason")} />
        </FormField>
      </form>
    </Modal>
  );
}
