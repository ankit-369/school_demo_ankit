"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GatedButton } from "@/components/ui/gated-button";
import { useCan } from "@/lib/hooks/use-can";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store/app-store";
import type { Student } from "@/lib/types/student";
import { ADD_NOTE_DEFAULTS, addNoteSchema, type AddNoteValues } from "./add-note-schema";
import { GuardianMessageFields } from "./guardian-message-fields";

const FORM_ID = "add-clinical-note";

function ToggleRow({ id, label, hint, checked, onChange }: { id: string; label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-line px-4 py-3">
      <label htmlFor={id} className="flex flex-col">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-[13px] text-ink-faint">{hint}</span>
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

/**
 * Used by anyone with `addNotes` — nurse, admin or doctor. Notifying the
 * guardian isn't part of this form: the note lands "pending" and a class
 * teacher or admin sends the message afterwards, from the Notes tab.
 */
export function AddNoteDialog({ student }: { student: Student }) {
  const [open, setOpen] = useState(false);
  const addNote = useAppStore((s) => s.addClinicalNote);
  const canAdd = useCan("addNotes");
  const form = useForm<AddNoteValues>({ resolver: zodResolver(addNoteSchema), defaultValues: ADD_NOTE_DEFAULTS });
  const e = form.formState.errors;

  function onOpenChange(next: boolean) {
    setOpen(next);
    form.reset(ADD_NOTE_DEFAULTS);
  }

  const onSubmit = form.handleSubmit((val) => {
    addNote({
      studentId: student.id,
      type: val.type,
      urgent: val.urgent,
      notes: val.notes,
      reason: val.reason,
      actionTaken: val.actionTaken,
      suggestion: val.suggestion,
    });
    onOpenChange(false);
    toast.success("Note saved", { description: `Waiting for a class teacher to tell ${student.guardian.name.split(" ")[0]}.` });
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Add clinical note"
      description={`For ${student.name}. Saved to the school record.`}
      trigger={<GatedButton allowed={canAdd} icon={Plus} lockedReason="Your role can't add clinical notes">Add clinical note</GatedButton>}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form={FORM_ID}>Save note</Button>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Type" htmlFor="an-type">
            <NativeSelect id="an-type" options={[{ value: "general", label: "General" }, { value: "incident", label: "Incident" }, { value: "screening", label: "Screening" }]} {...form.register("type")} />
          </FormField>
          <Controller control={form.control} name="urgent" render={({ field }) => (
            <ToggleRow id="an-urgent" label="Mark as urgent" hint="Flags it on the profile" checked={field.value} onChange={field.onChange} />
          )} />
        </div>
        <GuardianMessageFields form={form} />
        <FormField label="Additional internal notes" htmlFor="an-notes" error={e.notes?.message} optional hint="Not seen by the guardian">
          <Textarea {...fieldA11y("an-notes", e.notes?.message)} rows={2} {...form.register("notes")} />
        </FormField>
      </form>
    </Modal>
  );
}
