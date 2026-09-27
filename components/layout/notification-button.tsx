import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationButton() {
  return (
    <Button variant="ghost" size="icon" aria-label="Notifications, 3 unread" className="relative text-ink-soft">
      <Bell aria-hidden />
      <span
        aria-hidden
        className="absolute top-2 right-2 size-2 rounded-full bg-danger ring-2 ring-canvas"
      />
    </Button>
  );
}
