import type { StateCreator } from "zustand";
import type { Role } from "@/lib/types/role";
import type { AppState } from "@/lib/store/app-store";

export type SessionSlice = {
  /** The "Viewing as" role chosen in the top bar. */
  role: Role;
  setRole: (role: Role) => void;
};

export const createSessionSlice: StateCreator<
  AppState,
  [["zustand/persist", unknown]],
  [],
  SessionSlice
> = (set) => ({
  role: "admin",
  setRole: (role) => set({ role }),
});
