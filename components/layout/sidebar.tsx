"use client";

import { useSchoolName } from "@/lib/hooks/use-school-name";
import { Brand } from "./brand";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

export function Sidebar() {
  const schoolName = useSchoolName();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-canvas md:flex">
      <div className="flex h-16 items-center px-5">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav />
      </div>
      <div className="border-t border-line py-4">
        <p className="truncate px-3 pb-3 text-[13px] font-medium text-ink-faint">{schoolName}</p>
        <SidebarUser />
      </div>
    </aside>
  );
}
