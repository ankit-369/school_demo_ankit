"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { STUDENT_STATUS } from "@/lib/labels";
import { useAppStore } from "@/lib/store/app-store";
import type { Student, StudentStatus } from "@/lib/types/student";

const OPTIONS: { value: StudentStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "graduated", label: "Graduated" },
  { value: "transferred", label: "Transferred" },
  { value: "exited", label: "Exited" },
];

/** Requires a reason whenever the new status isn't "active" — kept separate from EditableSection, which has no notion of a conditionally-required field. */
export function StudentStatusControl({ student, canEdit }: { student: Student; canEdit: boolean }) {
  const setStatus = useAppStore((s) => s.setStudentStatus);
  const [editing, setEditing] = useState(false);
  const [next, setNext] = useState<StudentStatus>(student.status);
  const [reason, setReason] = useState("");

  if (!canEdit) return student.status !== "active" ? <StatusBadge {...STUDENT_STATUS[student.status]} /> : null;

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setNext(student.status);
          setReason("");
          setEditing(true);
        }}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-[13px] font-medium text-ink-soft transition-colors duration-150 hover:bg-surface"
      >
        {student.status !== "active" ? <StatusBadge {...STUDENT_STATUS[student.status]} className="h-auto border-0 bg-transparent p-0" /> : "Active"}
        · Change
      </button>
    );
  }

  const needsReason = next !== "active";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
      <NativeSelect
        id="student-status"
        value={next}
        options={OPTIONS}
        onChange={(e) => setNext(e.target.value as StudentStatus)}
        className="h-9 w-auto"
      />
      {needsReason && (
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for the change" className="h-9 w-56" />
      )}
      <Button
        size="sm"
        className="h-9"
        disabled={needsReason && reason.trim().length < 3}
        onClick={() => {
          setStatus(student.id, next, reason.trim());
          toast.success(`Status set to ${OPTIONS.find((o) => o.value === next)?.label}`);
          setEditing(false);
        }}
      >
        Save
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
    </div>
  );
}
