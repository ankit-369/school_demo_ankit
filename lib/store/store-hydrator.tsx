"use client";

import { useEffect } from "react";
import { useAppStore } from "./app-store";

/** Rehydrates the persisted store once on the client, after first paint. */
export function StoreHydrator() {
  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);
  return null;
}
