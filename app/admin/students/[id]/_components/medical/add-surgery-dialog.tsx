"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { localDateString } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { useAppStore } from "@/lib/store/app-store";

const schema = z.object({
  name: z.string().trim().min(2, "Enter the procedure"),
  date: z.string().min(1, "Enter a date").refine((v) => v <= localDateString(), "Date can't be in the future"),
  hospital: z.string().trim().min(2, "Enter the hospital"),
  outcome: z.enum(["successful", "complications", "ongoing-care"]),
});
type Values = z.infer<typeof schema>;

const DEFAULTS: Partial<Values> = { name: "", date: "", hospital: "", outcome: "successful" };
const FORM_ID = "add-surgery";

export function AddSurgeryDialog({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const addSurgery = useAppStore((s) => s.addSurgery);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: DEFAULTS });
  const e = form.formState.errors;

  const onSubmit = form.handleSubmit((v) => {
    addSurgery(studentId, v);
    setOpen(false);
    form.reset(DEFAULTS);
    toast.success(`${v.name} added to surgical history`);
  });

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      size="sm"
      title="Add surgery"
      trigger={
        <Button variant="ghost" size="sm" className="h-8 text-primary">
          <Plus aria-hidden />
          Add
        </Button>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form={FORM_ID}>Add surgery</Button>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField label="Procedure" htmlFor="sg-name" error={e.name?.message}>
          <Input {...fieldA11y("sg-name", e.name?.message)} {...form.register("name")} />
        </FormField>
        <FormField label="Date" htmlFor="sg-date" error={e.date?.message}>
          <Input {...fieldA11y("sg-date", e.date?.message)} type="date" {...form.register("date")} />
        </FormField>
        <FormField label="Hospital" htmlFor="sg-hospital" error={e.hospital?.message}>
          <Input {...fieldA11y("sg-hospital", e.hospital?.message)} {...form.register("hospital")} />
        </FormField>
        <FormField label="Outcome" htmlFor="sg-outcome">
          <NativeSelect
            id="sg-outcome"
            options={[
              { value: "successful", label: "Successful" },
              { value: "complications", label: "Complications" },
              { value: "ongoing-care", label: "Ongoing care" },
            ]}
            {...form.register("outcome")}
          />
        </FormField>
      </form>
    </Modal>
  );
}
