import type { ReactNode } from "react";
import { Brand } from "./brand";
import { RoleSwitcher } from "./role-switcher";
import { RoleSync } from "./role-sync";
import type { Role } from "@/lib/types/role";

type RoleAppShellProps = { role: Role; title: string; children: ReactNode };

/**
 * Mobile-first frame for the nurse and teacher apps: no sidebar or bottom bar,
 * one narrow column, big targets. The role switcher is the way back out.
 */
export function RoleAppShell({ role, title, children }: RoleAppShellProps) {
  return (
    <div className="min-h-dvh bg-surface">
      <RoleSync role={role} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden sm:block">
              <Brand />
            </span>
            <span className="truncate text-[15px] font-semibold text-ink sm:border-l sm:border-line sm:pl-3">{title}</span>
          </div>
          <RoleSwitcher />
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-2xl px-4 pt-5 pb-[calc(env(safe-area-inset-bottom)+6rem)]">
        {children}
      </main>
    </div>
  );
}
