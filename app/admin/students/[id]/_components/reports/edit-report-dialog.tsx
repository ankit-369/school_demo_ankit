"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { summarizeChanges } from "@/lib/audit-diff";
import { REPORT_CATEGORY_LABELS } from "@/lib/labels";
import { useAppStore } from "@/lib/store/app-store";
import type { Report, ReportCategory } from "@/lib/types/report";

const CATEGORIES = Object.keys(REPORT_CATEGORY_LABELS) as [ReportCategory, ...ReportCategory[]];

const schema = z.object({
  fileName: z.string().trim().min(1, "Enter a file name"),
  category: z.enum(CATEGORIES),
  uploadDate: z.string().min(1, "Enter a date"),
  doctor: z.string().trim(),
});
type Values = z.infer<typeof schema>;

const FORM_ID = "edit-report";

export function EditReportDialog({ report }: { report: Report }) {
  const [open, setOpen] = useState(false);
  const updateReport = useAppStore((s) => s.updateReport);
  const before: Values = { fileName: report.fileName, category: report.category, uploadDate: report.uploadDate.slice(0, 10), doctor: report.doctor ?? "" };
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: before });
  const e = form.formState.errors;

  function onOpenChange(next: boolean) {
    if (next) form.reset(before);
    setOpen(next);
  }

  const onSubmit = form.handleSubmit((v) => {
    const summary = summarizeChanges<Values>(
      [
        { name: "fileName", label: "File name" },
        { name: "category", label: "Category", format: (val) => REPORT_CATEGORY_LABELS[val as ReportCategory] },
        { name: "uploadDate", label: "Date" },
        { name: "doctor", label: "Doctor" },
      ],
      before,
      v,
    );
    if (summary) {
      updateReport(report.id, { fileName: v.fileName.trim(), category: v.category, uploadDate: v.uploadDate, doctor: v.doctor.trim() || undefined }, summary);
      toast.success("Report updated");
    }
    setOpen(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      mobile="dialog"
      title="Edit report"
      trigger={
        <Button variant="ghost" size="sm" className="h-8 text-ink-soft">
          <Pencil aria-hidden />
          Edit
        </Button>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form={FORM_ID}>Save changes</Button>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField label="File name" htmlFor="er-name" error={e.fileName?.message}>
          <Input {...fieldA11y("er-name", e.fileName?.message)} {...form.register("fileName")} />
        </FormField>
        <FormField label="Category" htmlFor="er-category">
          <NativeSelect id="er-category" options={CATEGORIES.map((c) => ({ value: c, label: REPORT_CATEGORY_LABELS[c] }))} {...form.register("category")} />
        </FormField>
        <FormField label="Date" htmlFor="er-date" error={e.uploadDate?.message}>
          <Input {...fieldA11y("er-date", e.uploadDate?.message)} type="date" {...form.register("uploadDate")} />
        </FormField>
        <FormField label="Doctor" htmlFor="er-doctor" optional>
          <Input id="er-doctor" placeholder="e.g. Dr. Sarah Jenkins" {...form.register("doctor")} />
        </FormField>
      </form>
    </Modal>
  );
}
