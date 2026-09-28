"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { pluralize } from "@/lib/format";
import { useCan } from "@/lib/hooks/use-can";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { isScreened, type ResultRow } from "@/lib/selectors/screening-results";
import { useAppStore } from "@/lib/store/app-store";
import type { Camp } from "@/lib/types/camp";
import type { Screening } from "@/lib/types/screening";
import { cn } from "@/lib/utils";

type SendToHfilesDialogProps = { camp: Camp; screening: Screening; rows: ResultRow[] };

/**
 * Bulk push. Students still pending have no result to send, so they're
 * skipped (and the dialog says so) rather than stamped as synced.
 */
export function SendToHfilesDialog({ camp, screening, rows }: SendToHfilesDialogProps) {
  const [open, setOpen] = useState(false);
  const can = useCan("sendToHfiles");
  const send = useAppStore((s) => s.sendScreeningResultsToHfiles);
  const ready = rows.filter(isScreened);
  const skipped = rows.length - ready.length;
  const allowed = can && ready.length > 0;

  function onConfirm() {
    const count = send(camp.id, screening.id, ready.map((r) => r.student.id));
    setOpen(false);
    toast.success(`Sent ${pluralize(count, "result")} to hfiles.in`, { description: "Each student's hfiles.in sync time was updated." });
  }

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      size="sm"
      mobile="dialog"
      title="Send results to hfiles.in?"
      description={`${SCREENING_TYPE_LABELS[screening.type]} · ${camp.name}`}
      trigger={
        <Button
          disabled={!allowed}
          title={!can ? "Your role can't send results to hfiles.in" : ready.length === 0 ? "No screened students in this view" : undefined}
          className={cn("bg-synced text-white hover:bg-synced/90")}
        >
          <Link2 aria-hidden />
          Send results to hfiles.in
        </Button>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="bg-synced text-white hover:bg-synced/90" onClick={onConfirm}>
            Send {pluralize(ready.length, "result")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 text-[15px] text-ink-soft">
        <p>
          <strong className="font-semibold text-ink">{pluralize(ready.length, "student")}</strong> will get this result added to their family&apos;s hfiles.in record, and their sync time updated.
        </p>
        {skipped > 0 && <p className="rounded-lg bg-surface px-4 py-3 text-sm">{pluralize(skipped, "student")} not screened yet will be skipped.</p>}
        {ready.some((r) => r.sentToHfiles) && <p className="text-sm">Results already sent will be refreshed, not duplicated.</p>}
      </div>
    </Modal>
  );
}
