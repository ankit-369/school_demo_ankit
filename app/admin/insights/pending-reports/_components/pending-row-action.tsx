"use client";

import { BellRing, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/format";
import type { PendingItem } from "@/lib/selectors/insights-reports";
import { useAppStore } from "@/lib/store/app-store";
import { reminderMessage } from "./reminder-message";

type PendingRowActionProps = { item: PendingItem; canNotify: boolean; canSync: boolean };

/** Screening items get a guardian reminder; unsynced uploads get "Sync now". */
export function PendingRowAction({ item, canNotify, canSync }: PendingRowActionProps) {
  const send = useAppStore((s) => s.sendNotification);
  const sync = useAppStore((s) => s.syncReportToHfiles);

  if (item.kind === "upload") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-primary"
        disabled={!canSync}
        title={canSync ? undefined : "Your role can't upload or sync reports"}
        onClick={() => {
          if (item.reportId) sync(item.reportId);
          toast.success("Synced to hfiles.in", { description: item.title });
        }}
      >
        <RefreshCw aria-hidden />
        Sync now
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {item.remindedAt && (
        <span className="inline-flex items-center gap-1 text-[13px] text-ink-faint">
          <Check aria-hidden className="size-3.5 text-success" />
          Reminded {formatRelative(item.remindedAt)}
        </span>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-primary"
        disabled={!canNotify}
        title={canNotify ? undefined : "Your role can't message guardians"}
        onClick={() => {
          send({ studentId: item.student.id, type: "report-reminder", channel: "whatsapp", message: reminderMessage(item), refId: item.id });
          toast.success(`Reminder sent to ${item.student.guardian.name}`, { description: "WhatsApp" });
        }}
      >
        <BellRing aria-hidden />
        {item.remindedAt ? "Remind again" : "Send reminder"}
      </Button>
    </div>
  );
}
