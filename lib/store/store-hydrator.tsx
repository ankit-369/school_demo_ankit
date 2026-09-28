"use client";

import { useEffect } from "react";
import { useAppStore } from "./app-store";

const STORAGE_KEY = "healthconnect-db";

/**
 * Rehydrates the persisted store once on the client, after first paint, and
 * again whenever another tab writes to it — so a doctor submitting results in
 * one tab shows up live on the nurse's camp summary in another.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useAppStore.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) void useAppStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
