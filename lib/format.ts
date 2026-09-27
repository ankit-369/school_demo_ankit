/**
 * Formatting helpers. Fixed locale + time zone so output never depends on
 * the machine rendering it.
 */
const TZ = "Asia/Kolkata";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: TZ });
const shortDateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: TZ });
const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ });

export function formatDate(iso: string) {
  return dateFmt.format(new Date(iso));
}

export function formatShortDate(iso: string) {
  return shortDateFmt.format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return `${dateFmt.format(new Date(iso))}, ${timeFmt.format(new Date(iso))}`;
}

export function formatDateRange(start: string, end: string) {
  return start === end ? formatDate(start) : `${formatShortDate(start)} – ${formatDate(end)}`;
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 86_400_000],
  ["month", 30 * 86_400_000],
  ["week", 7 * 86_400_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "3 days ago", "in 2 weeks", "just now". */
export function formatRelative(iso: string, now = Date.now()) {
  // Date-only values ("2026-09-28") are calendar days, not UTC midnight.
  if (iso.length === 10) {
    const [y, m, d] = iso.split("-").map(Number);
    const [ty, tm, td] = localDateString(new Date(now)).split("-").map(Number);
    const days = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86_400_000);
    if (Math.abs(days) < 7) return rtf.format(days, "day");
    return formatRelative(`${iso}T12:00:00`, now);
  }
  const diff = new Date(iso).getTime() - now;
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return "just now";
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ageFromDob(dob: string, now = new Date()) {
  const d = new Date(dob);
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export function initials(name: string) {
  const parts = name.replace(/^(Mr|Ms|Mrs|Dr|Nurse)\.?\s+/i, "").split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function firstName(name: string) {
  return name.split(/\s+/)[0];
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Today's date as YYYY-MM-DD in the user's local time zone (not UTC). */
export function localDateString(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
