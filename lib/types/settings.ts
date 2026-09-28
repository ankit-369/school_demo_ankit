export type SchoolProfile = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

export type TemplateKey = "pendingReportReminder" | "consentReminder";

export type NotificationTemplates = Record<TemplateKey, string>;
