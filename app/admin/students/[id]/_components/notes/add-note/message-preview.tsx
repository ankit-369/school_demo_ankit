import { MessageSquareText } from "lucide-react";
import { CHANNEL_LABELS } from "@/lib/labels";
import type { NotificationChannel } from "@/lib/types/notification";

type MessagePreviewProps = { message: string; channel: NotificationChannel; guardianName: string };

/** Shows exactly the text the guardian will receive. */
export function MessagePreview({ message, channel, guardianName }: MessagePreviewProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface p-4" aria-live="polite">
      <p className="flex items-center gap-2 text-[13px] font-medium text-ink-soft">
        <MessageSquareText aria-hidden className="size-4 text-ink-faint" />
        {CHANNEL_LABELS[channel]} preview to {guardianName}
      </p>
      <p className="max-w-[46ch] rounded-2xl rounded-tl-sm border border-line bg-canvas px-4 py-3 text-[15px] leading-6 text-ink">
        {message || <span className="text-ink-faint">Fill in the fields below to build the message.</span>}
      </p>
      <p className="text-[12px] text-ink-faint">
        {message.length} characters{channel === "sms" && message.length > 160 ? " · sent as 2 SMS" : ""}
      </p>
    </div>
  );
}
