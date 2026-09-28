import type { NotificationTemplates, TemplateKey } from "@/lib/types/settings";

export const TEMPLATE_INFO: { key: TemplateKey; label: string; placeholders: string[] }[] = [
  { key: "pendingReportReminder", label: "Pending screening reminder", placeholders: ["student", "title", "camp", "school", "date"] },
  { key: "consentReminder", label: "Consent form reminder", placeholders: ["student", "form", "school"] },
];

export const DEFAULT_TEMPLATES: NotificationTemplates = {
  pendingReportReminder:
    "Reminder from {{school}}: {{student}}'s {{title}} ({{camp}}) is still pending. Please make sure {{student}} is in school{{date}}, or contact the medical room to reschedule.",
  consentReminder: "Reminder from {{school}}: please sign the consent form “{{form}}” for {{student}} at your earliest convenience.",
};

/** Replaces {{key}} tokens; an unknown key is left as-is rather than silently dropped. */
export function applyTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (m, key: string) => vars[key] ?? m);
}
