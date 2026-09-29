"use client";

import { useSyncExternalStore } from "react";

const KEY = "healthconnect-guide-progress";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

/** The raw JSON string — a primitive, so useSyncExternalStore never sees a "changed" snapshot unless the content actually did. */
function readRaw() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw: string): number[] {
  try {
    const ids = JSON.parse(raw) as unknown;
    return Array.isArray(ids) ? ids.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
  }
}

/**
 * Which guide flows the visitor has checked off, persisted in localStorage
 * (separate from the demo data store — this survives "Reset demo data").
 * Reads through useSyncExternalStore, so server and first paint both see
 * "none checked" with no hydration mismatch, and no state-in-effect.
 */
export function useGuideProgress() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  const checked = parse(raw);

  function toggle(id: number) {
    const next = checked.includes(id) ? checked.filter((n) => n !== id) : [...checked, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Private browsing or storage disabled — the toggle still works for this visit.
    }
    notify();
  }

  return { checked, toggle };
}
