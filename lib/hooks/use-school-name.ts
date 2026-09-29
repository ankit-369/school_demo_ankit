"use client";

import { useAppStore } from "@/lib/store/app-store";

/** The current school's display name, live from Settings -> School profile. */
export function useSchoolName() {
  return useAppStore((s) => s.school.name);
}
