import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="border-b border-line bg-canvas px-4 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-2xl items-center">
          <Brand />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-4">
        <EmptyState
          icon={SearchX}
          title="We couldn't find that page"
          description="The link may be out of date, or the record was removed when the demo data was reset. Head back to the dashboard to pick up where you left off."
          action={
            <Button asChild>
              <Link href="/admin/dashboard">Go to the dashboard</Link>
            </Button>
          }
          className="w-full rounded-xl border border-line bg-canvas"
        />
      </main>
    </div>
  );
}
