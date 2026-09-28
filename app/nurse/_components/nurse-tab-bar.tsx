"use client";

import { ClipboardCheck, ListChecks, Tent } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { TabBar } from "@/components/layout/tab-bar";
import { localDateString } from "@/lib/format";
import { stationHref } from "@/lib/selectors/camp-day";
import { campPhase } from "@/lib/selectors/camps";
import { useAppStore } from "@/lib/store/app-store";

/** Camps · Roster · Summary. Off the camp pages, the camp tabs point at today's (or the next) camp. */
export function NurseTabBar() {
  const pathname = usePathname();
  const station = useSearchParams().get("s") ?? undefined;
  const fallbackId = useAppStore((s) => {
    const today = localDateString();
    const open = s.camps.filter((c) => campPhase(c) !== "completed").sort((a, b) => a.startDate.localeCompare(b.startDate));
    return (open.find((c) => c.startDate <= today && today <= c.endDate) ?? open[0])?.id;
  });
  const match = pathname.match(/^\/nurse\/camp\/([^/]+)\/([^/]+)/);
  // The screen page has its own Skip / Save & next bar.
  if (match?.[2] === "student") return null;

  const campId = match ? decodeURIComponent(match[1]) : fallbackId;
  const disabledReason = campId ? undefined : "No camp is running";
  return (
    <TabBar
      label="Camp-day"
      items={[
        { href: "/nurse", label: "Camps", icon: Tent, active: pathname === "/nurse" },
        { href: campId ? stationHref(campId, "roster", station) : "#roster", label: "Roster", icon: ListChecks, active: match?.[2] === "roster", disabledReason },
        { href: campId ? stationHref(campId, "summary", station) : "#summary", label: "Summary", icon: ClipboardCheck, active: match?.[2] === "summary", disabledReason },
      ]}
    />
  );
}
