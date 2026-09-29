"use client";

import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import type { DraftValues } from "@/lib/import/import-row";
import { DIVISIONS, GRADES, gradeLabel } from "@/lib/types/grade";
import type { ImportFieldKey } from "@/lib/import/import-fields";
import { cn } from "@/lib/utils";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

type RowFieldInputProps = {
  id: string;
  fieldKey: ImportFieldKey;
  values: DraftValues;
  onChange: (key: ImportFieldKey, value: string) => void;
  invalid?: boolean;
  className?: string;
};

/** One editable cell in the import review — a select for grade/division/gender/blood group, a text input for everything else. */
export function RowFieldInput({ id, fieldKey, values, onChange, invalid, className }: RowFieldInputProps) {
  const value = values[fieldKey];
  const errClass = invalid ? "border-danger focus-visible:border-danger" : undefined;

  if (fieldKey === "grade") {
    return (
      <NativeSelect
        id={id}
        value={value}
        placeholder="—"
        options={GRADES.map((g) => ({ value: g, label: gradeLabel(g) }))}
        onChange={(e) => onChange("grade", e.target.value)}
        className={cn(errClass, className)}
      />
    );
  }
  if (fieldKey === "division") {
    return (
      <NativeSelect
        id={id}
        value={value}
        placeholder="—"
        options={DIVISIONS.map((d) => ({ value: d, label: d }))}
        onChange={(e) => onChange("division", e.target.value)}
        className={cn(errClass, className)}
      />
    );
  }
  if (fieldKey === "gender") {
    return (
      <NativeSelect
        id={id}
        value={value}
        placeholder="—"
        options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]}
        onChange={(e) => onChange("gender", e.target.value)}
        className={cn(errClass, className)}
      />
    );
  }
  if (fieldKey === "bloodGroup") {
    return (
      <NativeSelect
        id={id}
        value={value}
        placeholder="—"
        options={BLOOD_GROUPS.map((b) => ({ value: b, label: b }))}
        onChange={(e) => onChange("bloodGroup", e.target.value)}
        className={cn(errClass, className)}
      />
    );
  }
  return <Input id={id} value={value} onChange={(e) => onChange(fieldKey, e.target.value)} className={cn("h-10", errClass, className)} />;
}
