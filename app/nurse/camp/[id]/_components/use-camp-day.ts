"use client";

import { useMemo } from "react";
import { resolveStation } from "@/lib/selectors/camp-day";
import { screeningRows } from "@/lib/selectors/screening-results";
import { useAppStore } from "@/lib/store/app-store";

/** The camp, the station (screening) being run, and its roster rows in class/roll order. */
export function useCampDay(campId: string, stationId?: string) {
  const camp = useAppStore((s) => s.camps.find((c) => c.id === campId));
  const students = useAppStore((s) => s.students);
  const station = useMemo(() => (camp ? resolveStation(camp, students, stationId) : undefined), [camp, students, stationId]);
  const rows = useMemo(() => (station ? screeningRows(station, students) : []), [station, students]);
  return { camp, station, rows, students };
}
