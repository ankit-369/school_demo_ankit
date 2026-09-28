import { firstName, formatDate, localDateString } from "@/lib/format";
import type { PendingItem } from "@/lib/selectors/insights-reports";

/** Guardian-facing text for a pending screening reminder. */
export function reminderMessage(item: PendingItem) {
  const who = firstName(item.student.name);
  const when = item.since >= localDateString() ? ` on ${formatDate(item.since)}` : "";
  return `Reminder from Shanti Asiatic School: ${who}'s ${item.title.toLowerCase()} (${item.campName}) is still pending. Please make sure ${who} is in school${when}, or contact the medical room to reschedule.`;
}
