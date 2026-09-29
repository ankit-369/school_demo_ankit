"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { summarizeChanges } from "@/lib/audit-diff";
import { cn } from "@/lib/utils";

export type EditableFieldType = "text" | "number" | "date" | "select" | "textarea";

export type EditableField<T> = {
  name: Extract<keyof T, string>;
  label: string;
  type: EditableFieldType;
  options?: { value: string; label: string }[];
  /** Appended in view mode only, e.g. "cm". */
  suffix?: string;
  /** Shared by the view display and the audit-log summary. */
  format?: (value: unknown) => string;
  /** Spans both grid columns. */
  span?: 1 | 2;
  step?: string;
};

type EditableSectionProps<T extends Record<string, unknown>> = {
  title: string;
  description?: string;
  badge?: ReactNode;
  canEdit: boolean;
  lockedReason?: string;
  values: T;
  fields: EditableField<T>[];
  schema: ZodType<T>;
  /** Persists the change; `summary` is the auto-generated "Field: old → new" audit text. */
  onSave: (values: T, summary: string) => void;
  columns?: 1 | 2;
  className?: string;
};

function displayValue<T>(field: EditableField<T>, raw: unknown): string {
  if (raw === undefined || raw === null || raw === "") return "—";
  const text = field.format ? field.format(raw) : String(raw);
  return field.suffix ? `${text} ${field.suffix}` : text;
}

/**
 * A Panel with a pencil "Edit" button: its field grid swaps between a
 * read-only view and inline inputs, with zod validation and an
 * automatically composed "Field: old → new" audit-log entry on save.
 */
export function EditableSection<T extends Record<string, unknown>>({
  title,
  description,
  badge,
  canEdit,
  lockedReason,
  values,
  fields,
  schema,
  onSave,
  columns = 2,
  className,
}: EditableSectionProps<T>) {
  const [editing, setEditing] = useState(false);
  const form = useForm<T>({ resolver: zodResolver(schema as ZodType<T, T>) as Resolver<T>, defaultValues: values as never });
  const errors = form.formState.errors as Record<string, { message?: string } | undefined>;

  function start() {
    form.reset(values as never);
    setEditing(true);
  }
  function cancel() {
    form.reset(values as never);
    setEditing(false);
  }

  const onSubmit = form.handleSubmit((next) => {
    const summary = summarizeChanges(fields, values, next);
    if (!summary) {
      setEditing(false);
      return;
    }
    onSave(next, summary);
    toast.success(`${title} updated`);
    setEditing(false);
  });

  const gridClass = cn("grid gap-4", columns === 2 && "sm:grid-cols-2");
  const viewGridClass = cn("grid grid-cols-1 gap-x-6 gap-y-3", columns === 2 && "sm:grid-cols-2");

  return (
    <Panel
      title={title}
      description={editing ? undefined : description}
      badge={badge}
      className={className}
      actions={
        canEdit ? (
          editing ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 border-line" onClick={cancel}>Cancel</Button>
              <Button size="sm" className="h-9" onClick={onSubmit}>Save</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="h-9 border-line" onClick={start}>
              <Pencil aria-hidden />
              Edit
            </Button>
          )
        ) : lockedReason ? (
          <span className="text-[13px] text-ink-faint">{lockedReason}</span>
        ) : null
      }
    >
      {editing ? (
        <form noValidate onSubmit={onSubmit} className={gridClass}>
          {fields.map((f) => (
            <EditableFieldInput key={f.name} field={f} form={form} error={errors[f.name]?.message} />
          ))}
        </form>
      ) : (
        <dl className={viewGridClass}>
          {fields.map((f) => (
            <div key={f.name} className={f.span === 2 ? "sm:col-span-2" : undefined}>
              <dt className="text-[13px] text-ink-faint">{f.label}</dt>
              <dd className="text-[15px] font-medium text-ink">{displayValue(f, values[f.name])}</dd>
            </div>
          ))}
        </dl>
      )}
    </Panel>
  );
}

function EditableFieldInput<T extends Record<string, unknown>>({
  field,
  form,
  error,
}: {
  field: EditableField<T>;
  form: UseFormReturn<T>;
  error?: string;
}) {
  const id = `es-${field.name}`;
  const wrapClass = field.span === 2 ? "sm:col-span-2" : undefined;

  if (field.type === "select" && field.options) {
    return (
      <FormField label={field.label} htmlFor={id} error={error} className={wrapClass}>
        <NativeSelect {...fieldA11y(id, error)} options={field.options} {...form.register(field.name as never)} />
      </FormField>
    );
  }
  if (field.type === "textarea") {
    return (
      <FormField label={field.label} htmlFor={id} error={error} className={wrapClass}>
        <Textarea {...fieldA11y(id, error)} rows={3} {...form.register(field.name as never)} />
      </FormField>
    );
  }
  const inputType = field.type === "number" ? "number" : field.type === "date" ? "date" : "text";
  return (
    <FormField label={field.label} htmlFor={id} error={error} className={wrapClass}>
      <Input
        {...fieldA11y(id, error)}
        type={inputType}
        step={field.step}
        {...form.register(field.name as never, field.type === "number" ? { valueAsNumber: true } : {})}
      />
    </FormField>
  );
}
