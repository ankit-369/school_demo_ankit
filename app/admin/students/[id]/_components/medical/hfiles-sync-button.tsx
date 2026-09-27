"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { pluralize } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";

type HfilesSyncButtonProps = { studentId: string; connected: boolean };

/** Mock pull from hfiles.in, with a short simulated network delay. */
export function HfilesSyncButton({ studentId, connected }: HfilesSyncButtonProps) {
  const sync = useAppStore((s) => s.syncFromHfiles);
  const [busy, setBusy] = useState(false);

  function onClick() {
    setBusy(true);
    window.setTimeout(() => {
      const added = sync(studentId);
      setBusy(false);
      toast.success(added ? `Synced — ${pluralize(added, "new record")} from hfiles.in` : "Synced — already up to date");
    }, 900);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={busy}
      className="h-9 border-synced/40 text-synced-ink hover:bg-synced/5 hover:text-synced-ink"
    >
      {busy ? <Loader2 aria-hidden className="animate-spin" /> : <RefreshCw aria-hidden />}
      {busy ? "Syncing…" : connected ? "Sync from hfiles.in" : "Connect & sync"}
    </Button>
  );
}
