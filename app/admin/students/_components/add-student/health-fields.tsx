"use client";

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { ChipSuggestInput } from "@/components/ui/chip-suggest-input";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { computeBmi } from "@/lib/data/seed/student-factory";
import { BLOOD_GROUPS, HEARING_STATUSES, type AddStudentValues } from "@/lib/schemas/student";
import { AddStudentSurgeries, type SurgeryDraft } from "./add-student-surgeries";

const ALLERGY_SUGGESTIONS = ["Peanuts", "Penicillin", "Pollen", "Dust mites", "Shellfish"];
const CONDITION_SUGGESTIONS = ["Asthma", "Diabetes", "ADHD", "Epilepsy"];
const HEARING_LABELS: Record<(typeof HEARING_STATUSES)[number], string> = { normal: "Normal", "mild-loss": "Mild loss", "needs-review": "Needs review" };

function bmiCategory(bmi: number): { label: string; className: string } {
  if (bmi < 18.5) return { label: "Underweight", className: "bg-warning/10 text-warning-ink" };
  if (bmi < 25) return { label: "Normal", className: "bg-success/10 text-success-ink" };
  return { label: "Overweight", className: "bg-warning/10 text-warning-ink" };
}

type HealthFieldsProps = {
  form: UseFormReturn<AddStudentValues>;
  surgeries: SurgeryDraft[];
  onSurgeriesChange: (next: SurgeryDraft[]) => void;
};

export function HealthFields({ form, surgeries, onSurgeriesChange }: HealthFieldsProps) {
  const { register, control, formState } = form;
  const e = formState.errors;
  const [heightCm, weightKg] = useWatch({ control, name: ["heightCm", "weightKg"] });
  const bmi = heightCm > 0 && weightKg > 0 ? computeBmi(heightCm, weightKg) : null;
  const category = bmi ? bmiCategory(bmi) : null;

  return (
    <fieldset className="grid grid-cols-2 gap-4">
      <legend className="mb-3 text-[15px] font-semibold text-ink">Health</legend>
      <FormField label="Blood group" htmlFor="as-blood" error={e.bloodGroup?.message}>
        <NativeSelect {...fieldA11y("as-blood", e.bloodGroup?.message)} placeholder="Select…" options={BLOOD_GROUPS.map((v) => ({ value: v, label: v }))} {...register("bloodGroup")} />
      </FormField>
      <div />
      <FormField label="Height (cm)" htmlFor="as-height" error={e.heightCm?.message}>
        <Input {...fieldA11y("as-height", e.heightCm?.message)} type="number" inputMode="decimal" step="0.1" {...register("heightCm", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Weight (kg)" htmlFor="as-weight" error={e.weightKg?.message}>
        <Input {...fieldA11y("as-weight", e.weightKg?.message)} type="number" inputMode="decimal" step="0.1" {...register("weightKg", { valueAsNumber: true })} />
      </FormField>
      {bmi && category && (
        <p className="col-span-2 -mt-2 flex items-center gap-2 text-sm text-ink-soft">
          BMI <span className="tabular font-semibold text-ink">{bmi.toFixed(1)}</span>
          <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ${category.className}`}>{category.label}</span>
        </p>
      )}
      <FormField label="Vision — left eye" htmlFor="as-vision-left" error={e.visionLeft?.message}>
        <Input {...fieldA11y("as-vision-left", e.visionLeft?.message)} placeholder="6/6" {...register("visionLeft")} />
      </FormField>
      <FormField label="Vision — right eye" htmlFor="as-vision-right" error={e.visionRight?.message}>
        <Input {...fieldA11y("as-vision-right", e.visionRight?.message)} placeholder="6/6" {...register("visionRight")} />
      </FormField>
      <FormField label="Hearing" htmlFor="as-hearing" className="col-span-2 sm:col-span-1">
        <NativeSelect id="as-hearing" options={HEARING_STATUSES.map((v) => ({ value: v, label: HEARING_LABELS[v] }))} {...register("hearing")} />
      </FormField>
      <div className="col-span-2" />
      <Controller
        control={control}
        name="allergies"
        render={({ field }) => (
          <FormField label="Allergies" htmlFor="as-allergies" optional hint="Separate with commas" className="col-span-2">
            <ChipSuggestInput id="as-allergies" value={field.value} onChange={field.onChange} suggestions={ALLERGY_SUGGESTIONS} placeholder="e.g. Peanuts, Penicillin" />
          </FormField>
        )}
      />
      <Controller
        control={control}
        name="conditions"
        render={({ field }) => (
          <FormField label="Conditions" htmlFor="as-conditions" optional hint="Separate with commas" className="col-span-2">
            <ChipSuggestInput id="as-conditions" value={field.value} onChange={field.onChange} suggestions={CONDITION_SUGGESTIONS} placeholder="e.g. Asthma" />
          </FormField>
        )}
      />
      <div className="col-span-2">
        <AddStudentSurgeries value={surgeries} onChange={onSurgeriesChange} />
      </div>
      <FormField label="Nurse notes" htmlFor="as-notes" optional className="col-span-2">
        <Textarea id="as-notes" rows={2} {...register("notes")} />
      </FormField>
    </fieldset>
  );
}
