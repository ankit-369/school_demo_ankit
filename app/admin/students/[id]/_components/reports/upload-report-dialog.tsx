"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { REPORT_CATEGORY_LABELS } from "@/lib/labels";
import { useAppStore } from "@/lib/store/app-store";
import type { ReportCategory } from "@/lib/types/report";
import { FilePicker } from "./file-picker";

const MAX_BYTES = 10 * 1024 * 1024;
const CATEGORIES = Object.keys(REPORT_CATEGORY_LABELS) as [ReportCategory, ...ReportCategory[]];

const schema = z.object({
  file: z
    .custom<File>((v) => typeof File !== "undefined" && v instanceof File, "Choose a file to upload")
    .refine((f) => f.size <= MAX_BYTES, "Files must be 10 MB or smaller"),
  category: z.enum(CATEGORIES, { error: "Select a category" }),
  displayName: z.string().trim(),
});
type Values = z.infer<typeof schema>;

const FORM_ID = "upload-report";

export function UploadReportDialog({ studentId, studentName }: { studentId: string; studentName: string }) {
  const [open, setOpen] = useState(false);
  const uploadReport = useAppStore((s) => s.uploadReport);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { displayName: "" } });
  const e = form.formState.errors;
  const file = useWatch({ control: form.control, name: "file" });

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) form.reset({ displayName: "" });
  }

  const onSubmit = form.handleSubmit((v) => {
    const ext = v.file.name.match(/\.[^.]+$/)?.[0] ?? "";
    const fileName = v.displayName ? `${v.displayName.replace(/\.[^.]+$/, "")}${ext}` : v.file.name;
    uploadReport({ studentId, fileName, category: v.category, size: v.file.size });
    onOpenChange(false);
    toast.success("Saved and synced to hfiles.in", { description: `${fileName} is now on ${studentName}'s hfiles.in timeline.` });
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload report"
      description="Reports are saved to the school record and pushed to the family's hfiles.in automatically."
      trigger={
        <Button>
          <Upload aria-hidden />
          Upload report
        </Button>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form={FORM_ID}>Save and sync</Button>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField label="File" htmlFor="ur-file" error={e.file?.message} hint="PDF or image, up to 10 MB">
          <FilePicker id="ur-file" error={e.file?.message} file={file} onChange={(f) => form.setValue("file", f as File, { shouldValidate: true })} />
        </FormField>
        <FormField label="Category" htmlFor="ur-category" error={e.category?.message}>
          <NativeSelect
            {...fieldA11y("ur-category", e.category?.message)}
            placeholder="Select…"
            options={CATEGORIES.map((c) => ({ value: c, label: REPORT_CATEGORY_LABELS[c] }))}
            {...form.register("category")}
          />
        </FormField>
        <FormField label="Display name" htmlFor="ur-name" optional hint="Defaults to the file name">
          <Input id="ur-name" placeholder="e.g. Eye test Sept 2026" {...form.register("displayName")} />
        </FormField>
      </form>
    </Modal>
  );
}
