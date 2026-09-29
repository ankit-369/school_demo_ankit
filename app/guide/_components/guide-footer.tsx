"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/app-store";

export function GuideFooter() {
  const resetDemoData = useAppStore((s) => s.resetDemoData);

  return (
    <footer className="border-t border-line px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
        <p className="max-w-sm text-[13px] text-ink-faint">
          Everything here runs on sample data. Nothing real is sent. Data stays in your browser.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            className="border-line"
            onClick={() => {
              resetDemoData();
              toast.success("Demo data reset");
            }}
          >
            <RotateCcw aria-hidden />
            Reset demo data
          </Button>
          <Button asChild>
            <Link href="/admin/dashboard">Open the app</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
