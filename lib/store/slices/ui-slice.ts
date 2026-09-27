import { createSeedData } from "@/lib/data/seed";
import type { Role } from "@/lib/types/role";
import type { SliceCreator } from "../state";

export type UiSlice = {
  /** The "Viewing as" role chosen in the top bar. */
  role: Role;
  setRole: (role: Role) => void;
  /** Restores every collection to the seed; keeps the current role. */
  resetDemoData: () => void;
};

export const createUiSlice: SliceCreator<UiSlice> = (set) => ({
  role: "admin",
  setRole: (role) => set({ role }),
  resetDemoData: () => set(createSeedData()),
});
