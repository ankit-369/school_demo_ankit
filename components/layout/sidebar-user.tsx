"use client";

import { useAppStore } from "@/lib/store/app-store";
import { ROLE_LABELS } from "@/lib/types/role";

export function SidebarUser() {
  const role = useAppStore((s) => s.role);
  return (
    <div className="flex items-center gap-3 px-3">
      <span
        aria-hidden
        className="flex size-9 items-center justify-center rounded-full bg-surface text-sm font-semibold text-ink-soft"
      >
        MA
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-medium text-ink">Mr. Ankit</p>
        <p className="truncate text-xs text-ink-faint">Viewing as {ROLE_LABELS[role]}</p>
      </div>
    </div>
  );
}
