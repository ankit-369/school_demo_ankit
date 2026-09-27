export type NotificationType =
  | "clinical-note"
  | "screening-result"
  | "report-shared"
  | "camp-reminder"
  | "consent-request";

export type NotificationChannel = "sms" | "whatsapp";

export type NotificationStatus = "queued" | "sent" | "delivered" | "failed";

export type Notification = {
  id: string;
  studentId: string;
  type: NotificationType;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  createdAt: string;
};
