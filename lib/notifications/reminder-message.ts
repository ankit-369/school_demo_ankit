import { applyTemplate } from "@/lib/data/templates";
import { firstName, formatDate, localDateString } from "@/lib/format";
import type { PendingItem } from "@/lib/selectors/insights-reports";

/** Guardian-facing text for a pending screening reminder, built from the school's editable template. */
export function reminderMessage(item: PendingItem, template: string, schoolName: string) {
  const who = firstName(item.student.name);
  const date = item.since >= localDateString() ? ` on ${formatDate(item.since)}` : "";
  return applyTemplate(template, { student: who, title: item.title.toLowerCase(), camp: item.campName ?? "", school: schoolName, date });
}
