"use client";

import type { UseFormReturn } from "react-hook-form";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { DIVISIONS, GRADES, gradeLabel } from "@/lib/types/grade";
import { BLOOD_GROUPS, type AddStudentValues } from "./add-student-schema";

const opts = (values: readonly string[], label: (v: string) => string = (v) => v) =>
  values.map((v) => ({ value: v, label: label(v) }));

export function StudentDetailsFields({ form }: { form: UseFormReturn<AddStudentValues> }) {
  const { register, formState } = form;
  const e = formState.errors;

  return (
    <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <legend className="mb-3 text-[15px] font-semibold text-ink">Student</legend>
      <FormField label="Full name" htmlFor="as-name" error={e.name?.message} className="sm:col-span-2">
        <Input {...fieldA11y("as-name", e.name?.message)} autoComplete="off" {...register("name")} />
      </FormField>
      <FormField label="Date of birth" htmlFor="as-dob" error={e.dob?.message}>
        <Input {...fieldA11y("as-dob", e.dob?.message)} type="date" {...register("dob")} />
      </FormField>
      <FormField label="Gender" htmlFor="as-gender" error={e.gender?.message}>
        <NativeSelect
          {...fieldA11y("as-gender", e.gender?.message)}
          placeholder="Select…"
          options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]}
          {...register("gender")}
        />
      </FormField>
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
      <FormField label="Blood group" htmlFor="as-blood" error={e.bloodGroup?.message}>
        <NativeSelect {...fieldA11y("as-blood", e.bloodGroup?.message)} placeholder="Select…" options={opts(BLOOD_GROUPS)} {...register("bloodGroup")} />
      </FormField>
      <FormField label="House" htmlFor="as-house" error={e.house?.message}>
        <NativeSelect {...fieldA11y("as-house", e.house?.message)} placeholder="Select…" options={opts(["Ganga", "Yamuna", "Kaveri", "Narmada"])} {...register("house")} />
      </FormField>
      <FormField label="Transport" htmlFor="as-transport">
        <NativeSelect
          id="as-transport"
          options={[
            { value: "school-bus", label: "School bus" },
            { value: "private", label: "Private" },
            { value: "walker", label: "Walks to school" },
          ]}
          {...register("transport")}
        />
      </FormField>
    </fieldset>
  );
}
