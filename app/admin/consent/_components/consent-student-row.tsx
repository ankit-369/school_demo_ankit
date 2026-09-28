"use client";

import { BellRing, Check } from "lucide-react";
import { toast } from "sonner";
import { GatedButton } from "@/components/ui/gated-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRelative } from "@/lib/format";
import { useCan } from "@/lib/hooks/use-can";
import type { ConsentRow } from "@/lib/selectors/consent";
import { useAppStore } from "@/lib/store/app-store";

export function ConsentStudentRow({ row, remindedAt }: { row: ConsentRow; remindedAt?: string }) {
  const { record, student } = row;
  const remind = useAppStore((s) => s.remindConsent);
  const sign = useAppStore((s) => s.signConsent);
  const canNotify = useCan("notifyGuardians");
  const canMark = useCan("manageStudents");

  return (
    <li className="flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-[15px] text-ink">
        {student.name}
        <span className="ml-2 text-[13px] text-ink-faint">{student.guardian.name}</span>
      </span>
      {record.status === "signed" ? (
        <StatusBadge tone="success" label="Signed" />
      ) : (
        <div className="flex items-center gap-2">
          {remindedAt && <span className="text-[13px] text-ink-faint">Reminded {formatRelative(remindedAt)}</span>}
          <GatedButton
            allowed={canMark}
            icon={Check}
            lockedReason="Your role can't record consent"
            variant="outline"
            size="sm"
            className="h-8 border-line"
            onClick={() => {
              sign(record.id);
              toast.success(`${record.formName} marked signed for ${student.name}`);
            }}
          >
            Mark signed
          </GatedButton>
          <GatedButton
            allowed={canNotify}
            icon={BellRing}
            lockedReason="Your role can't message guardians"
            variant="ghost"
            size="sm"
            className="h-8 text-primary"
            onClick={() => {
              remind(record.id);
              toast.success(`Reminder sent to ${student.guardian.name}`, { description: "WhatsApp" });
            }}
          >
            {remindedAt ? "Remind again" : "Remind"}
          </GatedButton>
        </div>
      )}
    </li>
  );
}
