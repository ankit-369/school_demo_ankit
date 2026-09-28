import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Column, ColumnMobile } from "@/lib/types/table";

export function mobileRole<T>(col: Column<T>, index: number, hasExplicitTitle: boolean): ColumnMobile {
  if (col.mobile) return col.mobile;
  if (!hasExplicitTitle && index === 0) return "title";
  return typeof col.header === "string" ? "field" : "action";
}

type DataTableCardsProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  caption: string;
  className?: string;
};

/** Phone layout for DataTable: one card per row — title and action on top, the rest as label/value pairs. */
export function DataTableCards<T>({ columns, rows, getRowId, caption, className }: DataTableCardsProps<T>) {
  const hasExplicitTitle = columns.some((c) => c.mobile === "title");
  const roles = columns.map((c, i) => mobileRole(c, i, hasExplicitTitle));
  const title = columns.filter((_, i) => roles[i] === "title");
  const actions = columns.filter((_, i) => roles[i] === "action");
  const fields = columns.filter((_, i) => roles[i] === "field");

  return (
    <ul aria-label={caption} className={cn("divide-y divide-line", className)}>
      {rows.map((row) => (
        <li key={getRowId(row)} className="flex flex-col gap-3 px-4 py-4">
          {(title.length > 0 || actions.length > 0) && (
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-0.5 text-[15px] font-medium text-ink [&_a]:tap-target">
                {title.map((c) => (
                  <div key={c.id} className="min-w-0 break-words">{c.cell(row)}</div>
                ))}
              </div>
              {actions.length > 0 && (
                <div className="flex shrink-0 items-center gap-1">
                  {actions.map((c) => (
                    <div key={c.id}>{c.cell(row)}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          {fields.length > 0 && (
            <dl className="grid grid-cols-[minmax(6rem,auto)_1fr] gap-x-4 gap-y-2 text-sm">
              {fields.map((c) => (
                <Field key={c.id} label={c.mobileLabel ?? (typeof c.header === "string" ? c.header : c.id)}>
                  <span className={cn(c.align === "right" && "tabular")}>{c.cell(row)}</span>
                </Field>
              ))}
            </dl>
          )}
        </li>
      ))}
    </ul>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-ink-faint">{label}</dt>
      <dd className="flex min-w-0 justify-end text-right break-words text-ink [&_a]:tap-target">{children}</dd>
    </>
  );
}
