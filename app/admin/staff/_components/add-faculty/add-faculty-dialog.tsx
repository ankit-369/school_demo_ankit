"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ClassPicker } from "@/components/ui/class-picker";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { useCan } from "@/lib/hooks/use-can";
import { STAFF_ROLE_LABELS } from "@/lib/labels";
import { useAppStore } from "@/lib/store/app-store";
import type { ClassKey } from "@/lib/types/grade";
import { ADD_FACULTY_DEFAULTS, addFacultySchema, STAFF_ROLES, type AddFacultyValues } from "./add-faculty-schema";

const FORM_ID = "add-faculty";

export function AddFacultyDialog() {
  const [open, setOpen] = useState(false);
  const can = useCan("manageStaff");
  const addStaff = useAppStore((s) => s.addStaff);
  const router = useRouter();
  const form = useForm<AddFacultyValues>({ resolver: zodResolver(addFacultySchema), defaultValues: ADD_FACULTY_DEFAULTS });
  const role = useWatch({ control: form.control, name: "role" });
  const e = form.formState.errors;

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) form.reset(ADD_FACULTY_DEFAULTS);
  }

  const onSubmit = form.handleSubmit((v) => {
    const id = addStaff({ ...v, assignedClasses: v.role === "teacher" ? (v.assignedClasses as ClassKey[]) : [] });
    onOpenChange(false);
    toast.success(`${v.name} added to staff`, {
      description: "Permissions start at the role's defaults.",
      action: { label: "Review access", onClick: () => router.push(`/admin/staff/${id}`) },
    });
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Add faculty"
      description="New staff get the default permissions for their role. You can fine-tune them afterwards."
      trigger={
        <Button disabled={!can} title={can ? undefined : "Your role can't manage staff"}>
          {can ? <UserPlus aria-hidden /> : <Lock aria-hidden />}
          Add faculty
        </Button>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form={FORM_ID}>Add faculty</Button>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full name" htmlFor="af-name" error={e.name?.message} className="sm:col-span-2">
          <Input {...fieldA11y("af-name", e.name?.message)} autoComplete="off" {...form.register("name")} />
        </FormField>
        <FormField label="Role" htmlFor="af-role" error={e.role?.message}>
          <NativeSelect {...fieldA11y("af-role", e.role?.message)} placeholder="Select…" options={STAFF_ROLES.map((r) => ({ value: r, label: STAFF_ROLE_LABELS[r] }))} {...form.register("role")} />
        </FormField>
        <FormField label="Department" htmlFor="af-dept" error={e.department?.message}>
          <Input {...fieldA11y("af-dept", e.department?.message)} placeholder="e.g. Senior School" {...form.register("department")} />
        </FormField>
        <FormField label="Email" htmlFor="af-email" error={e.email?.message}>
          <Input {...fieldA11y("af-email", e.email?.message)} type="email" autoComplete="off" {...form.register("email")} />
        </FormField>
        <FormField label="Phone" htmlFor="af-phone" error={e.phone?.message}>
          <Input {...fieldA11y("af-phone", e.phone?.message)} type="tel" autoComplete="off" {...form.register("phone")} />
        </FormField>
        <FormField label="Status" htmlFor="af-status">
          <NativeSelect id="af-status" options={[{ value: "active", label: "Active" }, { value: "on-leave", label: "On leave" }, { value: "inactive", label: "Inactive" }]} {...form.register("status")} />
        </FormField>
        {role === "teacher" && (
          <fieldset className="flex flex-col gap-3 sm:col-span-2">
            <legend className="mb-2 text-sm font-medium text-ink">Assigned classes</legend>
            <Controller
              control={form.control}
              name="assignedClasses"
              render={({ field }) => <ClassPicker value={field.value as ClassKey[]} onChange={field.onChange} />}
            />
          </fieldset>
        )}
      </form>
    </Modal>
  );
}
