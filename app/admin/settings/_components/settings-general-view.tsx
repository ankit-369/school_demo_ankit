"use client";

import { useAppStore } from "@/lib/store/app-store";
import { AcademicYearCard } from "./academic-year-card";
import { DemoDataCard } from "./demo-data-card";
import { OversightLinksCard } from "./oversight-links-card";
import { SchoolProfileCard } from "./school-profile-card";
import { TemplatesCard } from "./templates-card";

export function SettingsGeneralView() {
  const year = useAppStore((s) => s.academicYear);
  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <OversightLinksCard />
        <SchoolProfileCard />
        <AcademicYearCard year={year} />
        <DemoDataCard />
      </div>
      <TemplatesCard />
    </div>
  );
}
