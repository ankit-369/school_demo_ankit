"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { GatedButton } from "@/components/ui/gated-button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useCan } from "@/lib/hooks/use-can";
import { useAppStore } from "@/lib/store/app-store";
import { CAMP_DEFAULTS, campSchema, EMPTY_SCREENING, type CampValues, type ScreeningValues } from "./camp-schema";
import { DoctorOptions } from "./doctor-options";
import { ScreeningFields } from "./screening-fields";

const FORM_ID = "schedule-camp";

export function ScheduleCampDialog() {
  const [open, setOpen] = useState(false);
  const can = useCan("manageCamps");
  const addCamp = useAppStore((s) => s.addCamp);
  const router = useRouter();
  const form = useForm<CampValues>({ resolver: zodResolver(campSchema), defaultValues: CAMP_DEFAULTS });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "screenings" });
  const [startDate, endDate] = useWatch({ control: form.control, name: ["startDate", "endDate"] });
  const e = form.formState.errors;

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) form.reset(CAMP_DEFAULTS);
  }

  const onSubmit = form.handleSubmit((v) => {
    const id = addCamp(v);
    onOpenChange(false);
    toast.success(`${v.name} scheduled`, { action: { label: "Open camp", onClick: () => router.push(`/admin/camps/${id}`) } });
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Schedule health camp"
      description="Add each screening with its lead doctor and the classes it covers."
      trigger={
        <GatedButton allowed={can} icon={CalendarPlus} lockedReason="Your role can't schedule camps">
          Schedule camp
        </GatedButton>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form={FORM_ID}>Schedule camp</Button>
        </>
      }
    >
      <FormProvider {...form}>
        <form id={FORM_ID} noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
          <DoctorOptions />
          <FormField label="Camp name" htmlFor="sc-name" error={e.name?.message}>
            <Input {...fieldA11y("sc-name", e.name?.message)} placeholder="e.g. Spring Wellness Drive 2027" {...form.register("name")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start date" htmlFor="sc-start" error={e.startDate?.message}>
              <Input {...fieldA11y("sc-start", e.startDate?.message)} type="date" {...form.register("startDate")} />
            </FormField>
            <FormField label="End date" htmlFor="sc-end" error={e.endDate?.message}>
              <Input {...fieldA11y("sc-end", e.endDate?.message)} type="date" min={startDate || undefined} {...form.register("endDate")} />
            </FormField>
          </div>
          {fields.map((f, i) => (
            <ScreeningFields
              key={f.id}
              index={i}
              minDate={startDate || undefined}
              maxDate={endDate || undefined}
              onRemove={fields.length > 1 ? () => remove(i) : undefined}
            />
          ))}
          {e.screenings?.root?.message && <p role="alert" className="text-[13px] text-danger-ink">{e.screenings.root.message}</p>}
          <Button type="button" variant="outline" className="self-start border-dashed" onClick={() => append({ ...EMPTY_SCREENING, date: startDate } as ScreeningValues)}>
            <Plus aria-hidden />
            Add another screening
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
}
