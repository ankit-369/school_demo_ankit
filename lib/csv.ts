export type CsvCell = string | number | boolean | null | undefined;

/**
 * Neutralises spreadsheet formula injection: a cell beginning with = + - @
 * (that isn't a plain number or phone number) is prefixed with an apostrophe.
 */
function guard(value: string) {
  return /^[=@\t\r]/.test(value) || /^[+-](?![\d\s(])/.test(value) ? `'${value}` : value;
}

function escapeCell(cell: CsvCell) {
  if (cell === null || cell === undefined) return "";
  const text = guard(String(cell));
  return /[",\r\n]|^\s|\s$/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** RFC 4180 CSV with CRLF line endings. */
export function toCsv(headers: string[], rows: CsvCell[][]) {
  return [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
}

/** Triggers a browser download. Adds a BOM so Excel reads UTF-8 (e.g. "–", "₹") correctly. */
export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** "Dental screening — Annual Health Drive 2026" → "dental-screening-annual-health-drive-2026" */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
