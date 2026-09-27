"use client";

import type { UseFormReturn } from "react-hook-form";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { AddStudentValues } from "./add-student-schema";

export function HealthGuardianFields({ form }: { form: UseFormReturn<AddStudentValues> }) {
  const { register, formState } = form;
  const e = formState.errors;

  return (
    <>
      <fieldset className="grid grid-cols-2 gap-4">
        <legend className="mb-3 text-[15px] font-semibold text-ink">Health baseline</legend>
        <FormField label="Height (cm)" htmlFor="as-height" error={e.heightCm?.message}>
          <Input {...fieldA11y("as-height", e.heightCm?.message)} type="number" inputMode="decimal" step="0.1" {...register("heightCm", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Weight (kg)" htmlFor="as-weight" error={e.weightKg?.message}>
          <Input {...fieldA11y("as-weight", e.weightKg?.message)} type="number" inputMode="decimal" step="0.1" {...register("weightKg", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Vision" htmlFor="as-vision" error={e.vision?.message}>
          <Input {...fieldA11y("as-vision", e.vision?.message)} {...register("vision")} />
        </FormField>
        <FormField label="Hearing" htmlFor="as-hearing">
          <NativeSelect
            id="as-hearing"
            options={[
              { value: "normal", label: "Normal" },
              { value: "mild-loss", label: "Mild loss" },
              { value: "needs-review", label: "Needs review" },
            ]}
            {...register("hearing")}
          />
        </FormField>
        <FormField label="Allergies" htmlFor="as-allergies" optional hint="Separate with commas" className="col-span-2">
          <Input id="as-allergies" placeholder="e.g. Peanuts, Penicillin" {...register("allergies")} />
        </FormField>
        <FormField label="Conditions" htmlFor="as-conditions" optional hint="Separate with commas" className="col-span-2">
          <Input id="as-conditions" placeholder="e.g. Asthma" {...register("conditions")} />
        </FormField>
        <FormField label="Nurse notes" htmlFor="as-notes" optional className="col-span-2">
          <Textarea id="as-notes" rows={2} {...register("notes")} />
        </FormField>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-[15px] font-semibold text-ink">Guardian</legend>
        <FormField label="Name" htmlFor="as-guardian" error={e.guardianName?.message}>
          <Input {...fieldA11y("as-guardian", e.guardianName?.message)} autoComplete="off" {...register("guardianName")} />
        </FormField>
        <FormField label="Relation" htmlFor="as-relation">
          <NativeSelect
            id="as-relation"
            options={["Mother", "Father", "Guardian"].map((v) => ({ value: v, label: v }))}
            {...register("guardianRelation")}
          />
        </FormField>
        <FormField label="Phone" htmlFor="as-phone" error={e.guardianPhone?.message} className="sm:col-span-2">
          <Input {...fieldA11y("as-phone", e.guardianPhone?.message)} type="tel" inputMode="tel" autoComplete="off" {...register("guardianPhone")} />
        </FormField>
      </fieldset>
    </>
  );
}
