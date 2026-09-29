"use client";

import type { UseFormReturn } from "react-hook-form";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { AddNoteValues } from "./add-note-schema";

/** Structured fields the note is built from; also what a teacher or admin sends the guardian. */
export function GuardianMessageFields({ form }: { form: UseFormReturn<AddNoteValues> }) {
  const { register, formState } = form;
  const e = formState.errors;

  return (
    <div className="flex flex-col gap-4">
      <FormField label="Visit reason" htmlFor="an-reason" error={e.reason?.message} hint="…visited the medical room today for ___">
        <Input {...fieldA11y("an-reason", e.reason?.message)} placeholder="a mild fever" {...register("reason")} />
      </FormField>
      <FormField label="What was done" htmlFor="an-action" error={e.actionTaken?.message}>
        <Input {...fieldA11y("an-action", e.actionTaken?.message)} placeholder="Temperature checked, rested 30 minutes, sent back to class" {...register("actionTaken")} />
      </FormField>
      <FormField label="Suggestion" htmlFor="an-suggestion" optional>
        <Input id="an-suggestion" placeholder="Suggest a follow-up if it returns" {...register("suggestion")} />
      </FormField>
    </div>
  );
}
