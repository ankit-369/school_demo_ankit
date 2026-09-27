"use client";

import { useSyncExternalStore } from "react";
import { useAppStore } from "@/lib/store/app-store";

function subscribe(onChange: () => void) {
  return useAppStore.persist.onFinishHydration(onChange);
}

/**
 * True once localStorage data has been loaded into the store. Server render
 * and the first client render always see `false`, so gating on this avoids
 * both hydration mismatches and a flash of seed data.
 */
export function useStoreHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}
