"use client";

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { GUARDIAN_RELATIONS, type AddStudentValues } from "@/lib/schemas/student";

export function GuardianEmergencyFields({ form }: { form: UseFormReturn<AddStudentValues> }) {
  const { register, control, formState } = form;
  const e = formState.errors;
  const sameAsGuardian = useWatch({ control, name: "sameAsGuardian" });

  return (
    <>
      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-[15px] font-semibold text-ink">Guardian</legend>
        <FormField label="Name" htmlFor="as-guardian" error={e.guardianName?.message}>
          <Input {...fieldA11y("as-guardian", e.guardianName?.message)} autoComplete="off" {...register("guardianName")} />
        </FormField>
        <FormField label="Relation" htmlFor="as-relation">
          <NativeSelect id="as-relation" options={GUARDIAN_RELATIONS.map((v) => ({ value: v, label: v }))} {...register("guardianRelation")} />
        </FormField>
        <FormField label="Phone" htmlFor="as-phone" error={e.guardianPhone?.message} className="sm:col-span-2">
          <Input {...fieldA11y("as-phone", e.guardianPhone?.message)} type="tel" inputMode="tel" autoComplete="off" {...register("guardianPhone")} />
        </FormField>
        <FormField label="Mother's name" htmlFor="as-mother" optional>
          <Input id="as-mother" {...register("motherName")} />
        </FormField>
        <FormField label="Father's name" htmlFor="as-father" optional>
          <Input id="as-father" {...register("fatherName")} />
        </FormField>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-[15px] font-semibold text-ink">Emergency contact</legend>
        <Controller
          control={control}
          name="sameAsGuardian"
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4 rounded-lg border border-line px-4 py-3">
              <label htmlFor="as-same-as-guardian" className="flex flex-col">
                <span className="text-sm font-medium text-ink">Same as guardian</span>
                <span className="text-[13px] text-ink-faint">Uses the contact above for emergencies too</span>
              </label>
              <Switch id="as-same-as-guardian" checked={field.value} onCheckedChange={field.onChange} />
            </div>
          )}
        />
        {!sameAsGuardian && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" htmlFor="as-ec-name" error={e.emergencyContactName?.message}>
              <Input {...fieldA11y("as-ec-name", e.emergencyContactName?.message)} {...register("emergencyContactName")} />
            </FormField>
            <FormField label="Relation" htmlFor="as-ec-relation" error={e.emergencyContactRelation?.message}>
              <Input {...fieldA11y("as-ec-relation", e.emergencyContactRelation?.message)} placeholder="e.g. Uncle, Neighbour" {...register("emergencyContactRelation")} />
            </FormField>
            <FormField label="Phone" htmlFor="as-ec-phone" error={e.emergencyContactPhone?.message} className="sm:col-span-2">
              <Input {...fieldA11y("as-ec-phone", e.emergencyContactPhone?.message)} type="tel" inputMode="tel" {...register("emergencyContactPhone")} />
            </FormField>
          </div>
        )}
      </fieldset>
    </>
  );
}
