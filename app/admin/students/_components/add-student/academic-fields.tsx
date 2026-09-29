"use client";

import type { UseFormReturn } from "react-hook-form";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { HOUSES, TRANSPORTS, type AddStudentValues } from "@/lib/schemas/student";
import { DIVISIONS, GRADES, gradeLabel } from "@/lib/types/grade";

const opts = (values: readonly string[], label: (v: string) => string = (v) => v) => values.map((v) => ({ value: v, label: label(v) }));

const TRANSPORT_LABELS: Record<(typeof TRANSPORTS)[number], string> = { "school-bus": "School bus", private: "Private", walker: "Walks to school" };

export function AcademicFields({ form }: { form: UseFormReturn<AddStudentValues> }) {
  const { register, formState } = form;
  const e = formState.errors;

  return (
    <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <legend className="mb-3 text-[15px] font-semibold text-ink">Academic</legend>
      <FormField label="Class" htmlFor="as-grade" error={e.grade?.message}>
        <NativeSelect {...fieldA11y("as-grade", e.grade?.message)} placeholder="Select…" options={opts(GRADES, gradeLabel as (v: string) => string)} {...register("grade")} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Division" htmlFor="as-division" error={e.division?.message}>
          <NativeSelect {...fieldA11y("as-division", e.division?.message)} options={opts(DIVISIONS)} {...register("division")} />
        </FormField>
        <FormField label="Roll no." htmlFor="as-roll" error={e.rollNumber?.message}>
          <Input {...fieldA11y("as-roll", e.rollNumber?.message)} type="number" inputMode="numeric" {...register("rollNumber", { valueAsNumber: true })} />
        </FormField>
      </div>
      <FormField label="House" htmlFor="as-house" error={e.house?.message}>
        <NativeSelect {...fieldA11y("as-house", e.house?.message)} placeholder="Select…" options={opts(HOUSES)} {...register("house")} />
      </FormField>
      <FormField label="Transport" htmlFor="as-transport">
        <NativeSelect id="as-transport" options={TRANSPORTS.map((t) => ({ value: t, label: TRANSPORT_LABELS[t] }))} {...register("transport")} />
      </FormField>
    </fieldset>
  );
}
