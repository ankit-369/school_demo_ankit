"use client";

import { Compass, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useSyncExternalStore } from "react";

const KEY = "healthconnect-guide-mode";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function readVisible() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** A small floating pill back to /guide, shown after arriving via a GuideLink (?from=guide) and kept for the rest of the visit. */
function BackToGuidePillInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const visible = useSyncExternalStore(subscribe, readVisible, () => false);

  useEffect(() => {
    if (searchParams.get("from") !== "guide") return;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      // Private browsing or storage disabled — the pill just won't persist across pages.
    }
    notify();
  }, [searchParams]);

  if (!visible || pathname.startsWith("/guide")) return null;

  return (
    <div className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-40 flex items-center gap-1 rounded-full bg-ink py-1.5 pr-1.5 pl-3.5 text-white shadow-overlay">
      <Link href="/guide" className="flex items-center gap-1.5 text-[13px] font-medium">
        <Compass aria-hidden className="size-4" />
        Back to guide
      </Link>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          try {
            sessionStorage.removeItem(KEY);
          } catch {
            // Nothing to clean up if storage was never available.
          }
          notify();
        }}
        className="flex size-7 items-center justify-center rounded-full text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white"
      >
        <X aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}

/** Wrapped in Suspense: useSearchParams requires it for a statically-rendered tree. */
export function BackToGuidePill() {
  return (
    <Suspense fallback={null}>
      <BackToGuidePillInner />
    </Suspense>
  );
}
