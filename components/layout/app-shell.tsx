import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-h-dvh flex-col md:pl-60">
        <TopBar />
        <main
          id="main"
          className="mx-auto w-full max-w-[1264px] flex-1 px-4 pt-6 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+1.5rem)] sm:px-6 md:pb-10 lg:px-8 lg:pt-8"
        >
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
