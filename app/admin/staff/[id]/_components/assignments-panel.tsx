"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ClassPicker } from "@/components/ui/class-picker";
import { Panel } from "@/components/ui/panel";
import { useAppStore } from "@/lib/store/app-store";
import type { ClassKey } from "@/lib/types/grade";
import type { Staff } from "@/lib/types/staff";

/** Draft-then-save so a mis-tap doesn't immediately reassign a class. */
export function AssignmentsPanel({ staff, canManage }: { staff: Staff; canManage: boolean }) {
  const save = useAppStore((s) => s.setAssignedClasses);
  const [draft, setDraft] = useState<ClassKey[] | null>(null);
  const value = draft ?? staff.assignedClasses;
  const dirty = draft !== null && [...draft].sort().join() !== [...staff.assignedClasses].sort().join();

  return (
    <Panel
      title="Assigned classes"
      description={value.length ? `${value.length} class${value.length === 1 ? "" : "es"}: ${[...value].sort().join(", ")}` : "No classes assigned"}
      actions={
        dirty && (
          <>
            <Button variant="ghost" size="sm" className="h-9" onClick={() => setDraft(null)}>Cancel</Button>
            <Button
              size="sm"
              className="h-9"
              onClick={() => {
                if (draft) save(staff.id, draft);
                setDraft(null);
                toast.success("Class assignments saved");
              }}
            >
              Save
            </Button>
          </>
        )
      }
    >
      <ClassPicker value={value} onChange={setDraft} disabled={!canManage} />
    </Panel>
  );
}
