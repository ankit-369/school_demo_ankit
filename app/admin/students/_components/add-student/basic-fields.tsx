"use client";

import type { UseFormReturn } from "react-hook-form";
import { FilePicker } from "@/components/ui/file-picker";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import type { AddStudentValues } from "@/lib/schemas/student";

type BasicFieldsProps = {
  form: UseFormReturn<AddStudentValues>;
  photo?: File;
  onPhotoChange: (file?: File) => void;
};

export function BasicFields({ form, photo, onPhotoChange }: BasicFieldsProps) {
  const { register, formState } = form;
  const e = formState.errors;

  return (
    <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <legend className="mb-3 text-[15px] font-semibold text-ink">Basic</legend>
      <FormField label="Full name" htmlFor="as-name" error={e.name?.message} className="sm:col-span-2">
        <Input {...fieldA11y("as-name", e.name?.message)} autoComplete="off" {...register("name")} />
      </FormField>
      <FormField label="Photo" htmlFor="as-photo" optional hint="JPG or PNG, up to 2 MB" className="sm:col-span-2">
        <FilePicker id="as-photo" accept="image/*" noun="a photo" file={photo} onChange={onPhotoChange} />
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
    </fieldset>
  );
}
