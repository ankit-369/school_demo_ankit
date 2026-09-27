import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Column, ColumnAlign } from "@/lib/types/table";

const ALIGN: Record<ColumnAlign, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Accessible name for the table. */
  caption: string;
  /** Rendered in place of the body when there are no rows. */
  empty?: ReactNode;
  /** Constrains height so the sticky header engages, e.g. "max-h-[480px]". */
  scrollClassName?: string;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  caption,
  empty,
  scrollClassName,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-canvas shadow-soft", className)}>
      <div className={cn("overflow-auto", scrollClassName)}>
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="border-b border-line">
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  className={cn(
                    "h-11 px-4 text-xs font-medium whitespace-nowrap text-ink-soft uppercase first:pl-5 last:pr-5",
                    ALIGN[col.align ?? "left"],
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getRowId(row)}
                className="h-14 border-b border-line transition-colors duration-150 last:border-b-0 hover:bg-surface/70"
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={cn(
                      "px-4 py-2 whitespace-nowrap text-ink first:pl-5 last:pr-5",
                      ALIGN[col.align ?? "left"],
                      col.align === "right" && "tabular",
                      col.className,
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && empty}
      </div>
    </div>
  );
}
