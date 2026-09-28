"use client";

import { Search, UserX } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useAppStore } from "@/lib/store/app-store";
import type { StaffRole } from "@/lib/types/staff";
import { AddFacultyDialog } from "./add-faculty/add-faculty-dialog";
import { StaffGroup } from "./staff-group";

const GROUPS: { title: string; roles: StaffRole[] }[] = [
  { title: "Principal", roles: ["principal"] },
  { title: "Administration", roles: ["admin", "registrar"] },
  { title: "Teachers", roles: ["teacher"] },
  { title: "Nurses", roles: ["nurse"] },
];

export function StaffDirectory() {
  const staff = useAppStore((s) => s.staff);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? staff.filter((s) => [s.name, s.department, s.email, ...s.assignedClasses].some((v) => v.toLowerCase().includes(q))) : staff;
  }, [staff, query]);
  const groups = GROUPS.map((g) => ({ ...g, members: filtered.filter((s) => g.roles.includes(s.role)) })).filter((g) => g.members.length);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Profile & staff access"
        description={`${staff.filter((s) => s.status === "active").length} active staff. Open a profile to manage classes and permissions.`}
        actions={<AddFacultyDialog />}
      />
      <div className="relative sm:w-80">
        <label htmlFor="staff-search" className="sr-only">Search staff</label>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
        <input
          id="staff-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, department or class"
          className="h-10 pointer-coarse:h-11 pointer-coarse:text-base w-full rounded-lg border border-input bg-canvas pr-3 pl-9 text-sm text-ink outline-none placeholder:text-ink-faint focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
      </div>
      {groups.length === 0 ? (
        <EmptyState icon={UserX} title="No staff match" description="Try a different name or class." />
      ) : (
        groups.map((g) => <StaffGroup key={g.title} title={g.title} members={g.members} />)
      )}
    </div>
  );
}
