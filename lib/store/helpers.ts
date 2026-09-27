import { ROLE_PERSONAS } from "@/lib/data/personas";
import type { AppState } from "./state";

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

/** Name of the person acting under the current "Viewing as" role. */
export function actorName(state: Pick<AppState, "role">) {
  return ROLE_PERSONAS[state.role];
}
