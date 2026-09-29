"use client";

import { NotebookPen, ShieldAlert, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { TabBar } from "@/components/layout/tab-bar";
import { usePendingVisits } from "./use-pending-visits";

export function TeacherTabBar() {
  const pathname = usePathname();
  const pending = usePendingVisits().length;
  return (
    <TabBar
      label="My class"
      items={[
        { href: "/teacher/class", label: "My class", icon: Users, active: pathname.startsWith("/teacher/class"), badge: pending },
        { href: "/teacher/alerts", label: "Health alerts", shortLabel: "Alerts", icon: ShieldAlert, active: pathname.startsWith("/teacher/alerts") },
        { href: "/teacher/incident/new", label: "Log an incident", shortLabel: "Log incident", icon: NotebookPen, active: pathname.startsWith("/teacher/incident") },
      ]}
    />
  );
}
