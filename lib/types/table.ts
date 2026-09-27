import type { ReactNode } from "react";

export type ColumnAlign = "left" | "right" | "center";

export type Column<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Numeric columns should be right-aligned. */
  align?: ColumnAlign;
  className?: string;
};
