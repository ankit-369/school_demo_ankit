"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store/app-store";
import { DOCTOR_LIST_ID } from "./screening-fields";

/** Suggests doctors already used in past camps (free text is still allowed). */
export function DoctorOptions() {
  const camps = useAppStore((s) => s.camps);
  const doctors = useMemo(
    () => [...new Set(camps.flatMap((c) => c.screenings.map((s) => s.leadDoctor)))].sort(),
    [camps],
  );
  return (
    <datalist id={DOCTOR_LIST_ID}>
      {doctors.map((d) => (
        <option key={d} value={d} />
      ))}
    </datalist>
  );
}
