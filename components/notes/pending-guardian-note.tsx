"use client";

import { Check, MessageSquareText, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store/app-store";
import type { ClinicalNote } from "@/lib/types/clinical-note";

type PendingGuardianNoteProps = { note: ClinicalNote; guardianName: string };

/**
 * Inline "Notify guardian" / "No need to notify" controls for a pending
 * clinical note. Shown on the student's Notes tab and the teacher's "Visits
 * to share with guardians" list — the two places a teacher or admin resolves
 * a note the nurse couldn't message a guardian about themselves.
 */
export function PendingGuardianNote({ note, guardianName }: PendingGuardianNoteProps) {
  const notify = useAppStore((s) => s.notifyGuardianForNote);
  const skip = useAppStore((s) => s.markGuardianNotNeeded);
  const [mode, setMode] = useState<"idle" | "notify" | "skip">("idle");
  const [message, setMessage] = useState(note.draftMessage ?? "");
  const [skipReason, setSkipReason] = useState("");

  if (mode === "notify") {
    return (
      <div className="flex flex-col gap-2 rounded-lg bg-surface px-4 py-3">
        <p className="flex items-center gap-2 text-[13px] font-medium text-ink-soft">
          <MessageSquareText aria-hidden className="size-4 text-ink-faint" />
          WhatsApp to {guardianName}
        </p>
        <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="text-[15px]" />
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            disabled={!message.trim()}
            onClick={() => {
              notify(note.id, message.trim(), "whatsapp");
              toast.success("Guardian notified");
              setMode("idle");
            }}
          >
            Send
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setMode("idle")}>Cancel</Button>
        </div>
      </div>
    );
  }

  if (mode === "skip") {
    return (
      <div className="flex flex-col gap-2 rounded-lg bg-surface px-4 py-3">
        <label htmlFor={`skip-${note.id}`} className="text-[13px] font-medium text-ink-soft">Reason (optional)</label>
        <Input id={`skip-${note.id}`} value={skipReason} onChange={(e) => setSkipReason(e.target.value)} placeholder="e.g. Already spoke with the parent at pickup" />
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-line"
            onClick={() => {
              skip(note.id, skipReason.trim() || undefined);
              toast.success("Marked not needed");
              setMode("idle");
            }}
          >
            Confirm
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setMode("idle")}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => setMode("notify")}>
        <Check aria-hidden />
        Notify guardian
      </Button>
      <Button size="sm" variant="ghost" className="text-ink-soft" onClick={() => setMode("skip")}>
        <X aria-hidden />
        No need to notify
      </Button>
    </div>
  );
}
