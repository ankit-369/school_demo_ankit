"use client";

import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { ToggleChips } from "@/components/ui/toggle-chips";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { GRADES, gradeLabel, type Grade } from "@/lib/types/grade";
import { SCREENING_TYPES, type ScreeningValues } from "./camp-schema";

/** Any form that holds a `screenings` array — the Schedule Camp and Add Screening forms. */
type ScreeningsForm = { screenings: ScreeningValues[] };

export const DOCTOR_LIST_ID = "known-doctors";

type ScreeningFieldsProps = {
  index: number;
  onRemove?: () => void;
  minDate?: string;
  maxDate?: string;
};

export function ScreeningFields({ index, onRemove, minDate, maxDate }: ScreeningFieldsProps) {
  const { register, control, formState } = useFormContext<ScreeningsForm>();
  const e = formState.errors.screenings?.[index];
  const id = (f: string) => `scr-${index}-${f}`;

  return (
    <fieldset className="flex flex-col gap-4 rounded-lg border border-line p-4">
      <div className="flex items-center justify-between">
        <legend className="text-sm font-semibold text-ink">Screening {index + 1}</legend>
        {onRemove && (
          <Button type="button" variant="ghost" size="sm" className="h-8 text-ink-soft" onClick={onRemove} aria-label={`Remove screening ${index + 1}`}>
            <Trash2 aria-hidden />
            Remove
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Type" htmlFor={id("type")} error={e?.type?.message}>
          <NativeSelect
            {...fieldA11y(id("type"), e?.type?.message)}
            placeholder="Select…"
            options={SCREENING_TYPES.map((t) => ({ value: t, label: SCREENING_TYPE_LABELS[t] }))}
            {...register(`screenings.${index}.type`)}
          />
        </FormField>
        <FormField label="Lead doctor" htmlFor={id("doctor")} error={e?.leadDoctor?.message}>
          <Input {...fieldA11y(id("doctor"), e?.leadDoctor?.message)} list={DOCTOR_LIST_ID} autoComplete="off" placeholder="Dr. …" {...register(`screenings.${index}.leadDoctor`)} />
        </FormField>
        <FormField label="Date" htmlFor={id("date")} error={e?.date?.message}>
          <Input {...fieldA11y(id("date"), e?.date?.message)} type="date" min={minDate} max={maxDate} {...register(`screenings.${index}.date`)} />
        </FormField>
      </div>
      <div className="flex flex-col gap-1.5">
        <span id={id("std-label")} className="text-sm font-medium text-ink">Target standards</span>
        <Controller
          control={control}
          name={`screenings.${index}.targetStandards`}
          render={({ field }) => (
            <ToggleChips<Grade>
              label="Target standards"
              options={GRADES.map((g) => ({ value: g, label: gradeLabel(g) }))}
              value={field.value ?? []}
              onChange={field.onChange}
              invalid={Boolean(e?.targetStandards)}
              describedBy={e?.targetStandards ? `${id("std")}-error` : undefined}
            />
          )}
        />
        {e?.targetStandards && (
          <p id={`${id("std")}-error`} role="alert" className="text-[13px] text-danger-ink">{e.targetStandards.message}</p>
        )}
      </div>
    </fieldset>
  );
}
