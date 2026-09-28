import type { Notification, NotificationChannel, NotificationStatus, NotificationType } from "@/lib/types/notification";
import type { Student } from "@/lib/types/student";

export type NotificationRow = { notification: Notification; student: Student };

export type NotificationsFilter = {
  query: string;
  type: NotificationType | "";
  channel: NotificationChannel | "";
  status: NotificationStatus | "";
};

export const EMPTY_NOTIFICATIONS_FILTER: NotificationsFilter = { query: "", type: "", channel: "", status: "" };

export function notificationRows(notifications: Notification[], students: Student[], f: NotificationsFilter): NotificationRow[] {
  const byId = new Map(students.map((s) => [s.id, s]));
  const q = f.query.trim().toLowerCase();

  return notifications
    .map((notification) => ({ notification, student: byId.get(notification.studentId) }))
    .filter((r): r is NotificationRow => Boolean(r.student))
    .filter(({ notification, student }) => {
      if (f.type && notification.type !== f.type) return false;
      if (f.channel && notification.channel !== f.channel) return false;
      if (f.status && notification.status !== f.status) return false;
      if (q && ![student.name, student.hfid, notification.message].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    })
    .sort((a, b) => b.notification.createdAt.localeCompare(a.notification.createdAt));
}
