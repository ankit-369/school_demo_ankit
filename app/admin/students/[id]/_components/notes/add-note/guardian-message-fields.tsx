"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AddNoteValues } from "./add-note-schema";

const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "sms", label: "SMS" },
] as const;

export function GuardianMessageFields({ form }: { form: UseFormReturn<AddNoteValues> }) {
  const { register, formState, control } = form;
  const e = formState.errors;
  const channel = useWatch({ control, name: "channel" });

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium text-ink">Send via</legend>
        <div className="inline-flex w-fit rounded-lg border border-line p-0.5">
          {CHANNELS.map((c) => (
            <label
              key={c.value}
              className={cn(
                "flex h-9 cursor-pointer items-center rounded-md px-4 text-sm font-medium transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary pointer-coarse:h-11",
                channel === c.value ? "bg-primary text-white" : "text-ink-soft hover:text-ink",
              )}
            >
              <input type="radio" value={c.value} className="sr-only" {...register("channel")} />
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>
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
