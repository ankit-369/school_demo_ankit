"use client";

import { useCurrentStudent } from "../student-context";
import { HfilesPanel } from "./hfiles-panel";
import { SchoolRecordsPanel } from "./school-records-panel";

/** Two deliberately separate sources, side by side — never merged into one field. */
export function MedicalHistoryTab() {
  const student = useCurrentStudent();
  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <SchoolRecordsPanel student={student} />
      <HfilesPanel student={student} />
    </div>
  );
}
