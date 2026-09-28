import type { Metadata } from "next";
import { HeartPulse, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: { default: "Doctor access", template: "%s · Doctor access" },
  robots: { index: false, follow: false },
};

/** No sign-in, no app navigation, no role switcher: the link itself is the access. */
export default function DoctorLayout({ children }: LayoutProps<"/doctor">) {
  return (
    <div className="min-h-dvh bg-surface">
      <header className="border-b border-line bg-canvas pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
          <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white">
              <HeartPulse aria-hidden className="size-4" />
            </span>
            HealthConnect
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-faint">
            <Lock aria-hidden className="size-3.5" />
            External doctor access
          </span>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-3xl px-4 pt-5 pb-[calc(env(safe-area-inset-bottom)+3rem)]">
        {children}
      </main>
    </div>
  );
}
