import type { ReactNode } from "react";

export type ColumnAlign = "left" | "right" | "center";

/** How a column renders when the table collapses to stacked cards on phones. */
export type ColumnMobile = "title" | "field" | "action" | "hidden";

export type Column<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Numeric columns should be right-aligned. */
  align?: ColumnAlign;
  className?: string;
  /**
   * Card role on phones. Defaults: first column is the title, a column with a
   * non-text header (e.g. sr-only "Actions") is the action, the rest are fields.
   */
  mobile?: ColumnMobile;
  /** Label used on phone cards when the header isn't plain text. */
  mobileLabel?: string;
};
