export type NotificationType =
  | "clinical-note"
  | "screening-result"
  | "report-shared"
  | "camp-reminder"
  | "consent-request"
  | "report-reminder";

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
  /** Id of the record this is about (e.g. a pending item), so the UI can show "reminded". */
  refId?: string;
};
