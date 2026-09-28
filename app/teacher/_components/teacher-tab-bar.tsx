"use client";

import { NotebookPen, ShieldAlert, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { TabBar } from "@/components/layout/tab-bar";

export function TeacherTabBar() {
  const pathname = usePathname();
  return (
    <TabBar
      label="My class"
      items={[
        { href: "/teacher/class", label: "My class", icon: Users, active: pathname.startsWith("/teacher/class") },
        { href: "/teacher/alerts", label: "Health alerts", shortLabel: "Alerts", icon: ShieldAlert, active: pathname.startsWith("/teacher/alerts") },
        { href: "/teacher/incident/new", label: "Log an incident", shortLabel: "Log incident", icon: NotebookPen, active: pathname.startsWith("/teacher/incident") },
      ]}
    />
  );
}
