"use client";

import { ChevronDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store/app-store";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/types/role";

export function RoleSwitcher() {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 border-line pr-2.5 pl-3 text-ink">
          <Eye aria-hidden className="text-ink-faint" />
          <span className="hidden text-ink-soft lg:inline">Viewing as</span>
          <span className="font-semibold">{ROLE_LABELS[role]}</span>
          <ChevronDown aria-hidden className="text-ink-faint" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-1 shadow-overlay">
        <DropdownMenuLabel className="text-xs font-normal text-ink-faint">
          Preview the app as
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={role} onValueChange={(v) => setRole(v as Role)}>
          {ROLES.map((r) => (
            <DropdownMenuRadioItem key={r} value={r} className="h-9 pointer-coarse:h-11">
              {ROLE_LABELS[r]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
