"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

/** Links to the notifications log; the dot reflects messages still awaiting delivery. */
export function NotificationButton() {
  const pending = useAppStore((s) => s.notifications.filter((n) => n.status === "sent").length);
  return (
    <Link
      href="/admin/notifications-log"
      aria-label={pending > 0 ? `Notifications, ${pending} awaiting delivery` : "Notifications"}
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors duration-150 hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary",
      )}
    >
      <Bell aria-hidden className="size-[18px]" />
      {pending > 0 && <span aria-hidden className="absolute top-2 right-2 size-2 rounded-full bg-danger ring-2 ring-canvas" />}
    </Link>
  );
}
