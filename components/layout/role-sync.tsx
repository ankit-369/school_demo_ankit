"use client";

import { useEffect, useRef } from "react";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { useAppStore } from "@/lib/store/app-store";
import type { Role } from "@/lib/types/role";

/**
 * Entering a role app acts as that role, so audit entries and permissions are
 * attributed correctly. Runs once, after hydration (or the persisted role would
 * win) — never again, so picking another role in the switcher isn't undone
 * while the navigation away is still in flight.
 */
export function RoleSync({ role }: { role: Role }) {
  const hydrated = useStoreHydrated();
  const done = useRef(false);
  useEffect(() => {
    if (!hydrated || done.current) return;
    done.current = true;
    const { role: current, setRole } = useAppStore.getState();
    if (current !== role) setRole(role);
  }, [hydrated, role]);
  return null;
}
