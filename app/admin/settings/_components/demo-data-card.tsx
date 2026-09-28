"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useCan } from "@/lib/hooks/use-can";
import { useAppStore } from "@/lib/store/app-store";

/** Lets whoever is demoing the app start fresh without opening dev tools. */
export function DemoDataCard() {
  const reset = useAppStore((s) => s.resetDemoData);
  const canManage = useCan("manageSettings");
  const [confirming, setConfirming] = useState(false);

  return (
    <Panel title="Demo data" description="Restores every student, camp, staff member and log to the original seed. Useful mid-demo.">
      {confirming ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-danger/5 px-4 py-3">
          <p className="text-sm text-ink">This discards every change made in this browser. There is no undo.</p>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" className="h-8 border-line" onClick={() => setConfirming(false)}>Cancel</Button>
            <Button
              size="sm"
              className="h-8 bg-danger text-white hover:bg-danger/90"
              onClick={() => {
                reset();
                setConfirming(false);
                toast.success("Demo data reset to the original seed");
              }}
            >
              Reset everything
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" className="w-fit border-line" disabled={!canManage} title={canManage ? undefined : "Your role can't manage settings"} onClick={() => setConfirming(true)}>
          <RotateCcw aria-hidden />
          Reset demo data
        </Button>
      )}
    </Panel>
  );
}
