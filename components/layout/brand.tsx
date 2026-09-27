import Link from "next/link";
import { HeartPulse } from "lucide-react";

export function Brand() {
  return (
    <Link
      href="/admin/dashboard"
      className="flex items-center gap-2.5 rounded-md text-ink"
      aria-label="HealthConnect home"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
        <HeartPulse aria-hidden className="size-[18px]" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[15px] font-semibold tracking-tight">HealthConnect</span>
        <span className="text-xs text-ink-faint">Admin portal</span>
      </span>
    </Link>
  );
}
