"use client";

import type { ReactNode } from "react";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";

type HydrationGateProps = {
  children: ReactNode;
  fallback: ReactNode;
};

/** Renders store-driven UI only once persisted data has loaded. */
export function HydrationGate({ children, fallback }: HydrationGateProps) {
  const hydrated = useStoreHydrated();
  return hydrated ? children : <div aria-busy="true">{fallback}</div>;
}
