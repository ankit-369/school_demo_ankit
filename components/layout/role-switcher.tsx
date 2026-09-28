"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, ChevronDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_APPS, ROLE_HOME } from "@/lib/data/role-homes";
import { useAppStore } from "@/lib/store/app-store";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/types/role";

/**
 * Inside /admin, picking a role previews the admin app as that role (permissions
 * change in place). Outside /admin (the nurse and teacher apps), picking a role
 * takes you to that role's own experience.
 */
export function RoleSwitcher() {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);
  const pathname = usePathname();
  const router = useRouter();
  const inAdmin = pathname.startsWith("/admin");

  function pick(next: Role) {
    setRole(next);
    if (!inAdmin) router.push(ROLE_HOME[next]);
  }

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
      <DropdownMenuContent align="end" className="w-60 p-1 shadow-overlay">
        <DropdownMenuLabel className="text-xs font-normal text-ink-faint">
          {inAdmin ? "Preview the admin app as" : "Switch to"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={role} onValueChange={(v) => pick(v as Role)}>
          {ROLES.map((r) => (
            <DropdownMenuRadioItem key={r} value={r} className="h-9 pointer-coarse:h-11">
              {ROLE_LABELS[r]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-ink-faint">Open a role app</DropdownMenuLabel>
        {ROLE_APPS.filter((a) => !pathname.startsWith(a.href.split("/").slice(0, 2).join("/"))).map((a) => (
          <DropdownMenuItem key={a.href} asChild className="h-9 pointer-coarse:h-11">
            <Link href={a.href} onClick={() => setRole(a.role)}>
              {a.label}
              <ArrowUpRight aria-hidden className="ml-auto size-4 text-ink-faint" />
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
