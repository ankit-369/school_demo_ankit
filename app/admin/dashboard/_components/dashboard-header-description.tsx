"use client";

import { useSchoolName } from "@/lib/hooks/use-school-name";

export function DashboardHeaderDescription() {
  const schoolName = useSchoolName();
  return <>Here&apos;s today&apos;s health overview for {schoolName}.</>;
}
