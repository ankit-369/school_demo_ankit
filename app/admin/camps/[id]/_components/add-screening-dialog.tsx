"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { GatedButton } from "@/components/ui/gated-button";
import { Modal } from "@/components/ui/modal";
import { formatDateRange } from "@/lib/format";
import { useCan } from "@/lib/hooks/use-can";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { useAppStore } from "@/lib/store/app-store";
import type { Camp } from "@/lib/types/camp";
import { EMPTY_SCREENING, screeningSchema, type ScreeningValues } from "../../_components/schedule-camp/camp-schema";
import { DoctorOptions } from "../../_components/schedule-camp/doctor-options";
import { ScreeningFields } from "../../_components/schedule-camp/screening-fields";

type Values = { screenings: ScreeningValues[] };
const FORM_ID = "add-screening";

export function AddScreeningDialog({ camp }: { camp: Camp }) {
  const [open, setOpen] = useState(false);
  const can = useCan("manageCamps");
  const addScreening = useAppStore((s) => s.addScreening);
  const router = useRouter();
  const schema = z.object({
    screenings: z.array(
      screeningSchema.refine((s) => s.date >= camp.startDate && s.date <= camp.endDate, {
        path: ["date"],
        message: `Must fall within ${formatDateRange(camp.startDate, camp.endDate)}`,
      }),
    ),
  });
  const defaults: Values = { screenings: [{ ...EMPTY_SCREENING, date: camp.startDate } as ScreeningValues] };
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) form.reset(defaults);
  }

  const onSubmit = form.handleSubmit(({ screenings: [s] }) => {
    const id = addScreening(camp.id, s);
    onOpenChange(false);
    toast.success(`${SCREENING_TYPE_LABELS[s.type]} added to ${camp.name}`, {
      action: { label: "Open results", onClick: () => router.push(`/admin/camps/${camp.id}/${id}`) },
    });
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Add screening"
      description={`${camp.name} · ${formatDateRange(camp.startDate, camp.endDate)}`}
      trigger={
        <GatedButton allowed={can} icon={Plus} lockedReason="Your role can't manage camps">
          Add screening
        </GatedButton>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form={FORM_ID}>Add screening</Button>
        </>
      }
    >
      <FormProvider {...form}>
        <form id={FORM_ID} noValidate onSubmit={onSubmit}>
          <DoctorOptions />
          <ScreeningFields index={0} minDate={camp.startDate} maxDate={camp.endDate} />
        </form>
      </FormProvider>
    </Modal>
  );
}
