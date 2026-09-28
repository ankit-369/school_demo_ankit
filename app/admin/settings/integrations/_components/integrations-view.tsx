"use client";

import { useMemo } from "react";
import { connectionStats, recentSyncs } from "@/lib/selectors/integrations";
import { useAppStore } from "@/lib/store/app-store";
import { HfilesStatusCard } from "./hfiles-status-card";
import { RecentSyncsPanel } from "./recent-syncs-panel";

export function IntegrationsView() {
  const students = useAppStore((s) => s.students);
  const stats = useMemo(() => connectionStats(students), [students]);
  const rows = useMemo(() => recentSyncs(students), [students]);

  return (
    <div className="flex flex-col gap-6">
      <HfilesStatusCard total={stats.total} connected={stats.connected} />
      <RecentSyncsPanel rows={rows} />
    </div>
  );
}
