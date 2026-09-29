"use client";

import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { GuideLink } from "@/components/layout/guide-link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/app-store";
import { TOTAL_FLOW_COUNT } from "@/lib/guide/flows";

const START_AS = [
  { role: "admin" as const, href: "/admin/dashboard", label: "Admin" },
  { role: "nurse" as const, href: "/nurse", label: "Nurse" },
  { role: "teacher" as const, href: "/teacher/class", label: "Teacher" },
  { role: "doctor" as const, href: "/doctor/camp/demo-rodriguez-ent", label: "Visiting doctor" },
];

export function GuideHero({ checkedCount }: { checkedCount: number }) {
  const resetDemoData = useAppStore((s) => s.resetDemoData);

  return (
    <header className="flex flex-col items-center gap-6 px-4 pt-10 pb-8 text-center sm:pt-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl leading-9 font-semibold tracking-tight text-ink sm:text-4xl sm:leading-10">HealthConnect in 3 minutes</h1>
        <p className="mx-auto max-w-md text-[16px] text-ink-soft">One place for a school&apos;s health records, camps and guardian updates.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-[13px] font-medium text-ink-faint">Start as</span>
        {START_AS.map((s) => (
          <GuideLink key={s.role} role={s.role} href={s.href} size="lg">
            {s.label}
          </GuideLink>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex h-8 items-center rounded-full bg-surface px-3 text-[13px] font-medium text-ink-soft ring-1 ring-line ring-inset">
          {checkedCount} of {TOTAL_FLOW_COUNT} flows checked
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-ink-soft"
          onClick={() => {
            resetDemoData();
            toast.success("Demo data reset");
          }}
        >
          <RotateCcw aria-hidden />
          Reset demo data
        </Button>
      </div>
    </header>
  );
}
