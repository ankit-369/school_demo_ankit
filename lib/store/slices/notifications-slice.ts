import type { Notification } from "@/lib/types/notification";
import { newId, nowIso } from "../helpers";
import type { SliceCreator } from "../state";

export type SendNotificationInput = Pick<Notification, "studentId" | "type" | "message" | "channel" | "refId"> & {
  /** Defaults to now; pass to tie the notification to another record's timestamp. */
  createdAt?: string;
};

export type NotificationsSlice = {
  notifications: Notification[];
  /** Simulated send — lands as "sent"; returns the new id. */
  sendNotification: (input: SendNotificationInput) => string;
  markNotificationDelivered: (id: string) => void;
};

export const createNotificationsSlice: SliceCreator<NotificationsSlice> = (set) => ({
  notifications: [],
  sendNotification: ({ createdAt = nowIso(), ...input }) => {
    const id = newId("ntf");
    set((s) => ({
      notifications: [{ ...input, id, status: "sent", createdAt }, ...s.notifications],
    }));
    return id;
  },
  markNotificationDelivered: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, status: "delivered" } : n)),
    })),
});
