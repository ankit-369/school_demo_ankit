import { createSeedData } from "@/lib/data/seed";
import { DEFAULT_TEMPLATES } from "@/lib/data/templates";
import type { Role } from "@/lib/types/role";
import type { SliceCreator } from "../state";
import { DEFAULT_SCHOOL } from "./settings-slice";

export type UiSlice = {
  /** The "Viewing as" role chosen in the top bar. */
  role: Role;
  setRole: (role: Role) => void;
  /** Restores every collection, the academic year and settings to the seed; keeps the current role. */
  resetDemoData: () => void;
};

export const createUiSlice: SliceCreator<UiSlice> = (set) => ({
  role: "admin",
  setRole: (role) => set({ role }),
  resetDemoData: () =>
    set({ ...createSeedData(), academicYear: "2026-27", school: DEFAULT_SCHOOL, templates: { ...DEFAULT_TEMPLATES } }),
});
