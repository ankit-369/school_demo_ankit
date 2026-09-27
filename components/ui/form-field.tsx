import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

/** Label + control + hint/error, with the error wired for screen readers via id `${htmlFor}-error`. */
export function FormField({ label, htmlFor, error, hint, optional, className, children }: FormFieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {optional && <span className="font-normal text-ink-faint"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-[13px] text-danger-ink">
          {error}
        </p>
      ) : (
        hint && <p className="text-[13px] text-ink-faint">{hint}</p>
      )}
    </div>
  );
}

/** Props to spread on a control so it announces its error state. */
export function fieldA11y(id: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}
