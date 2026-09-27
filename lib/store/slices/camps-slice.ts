import type { StateCreator } from "zustand";
import type { HealthCamp } from "@/lib/types/camp";
import type { AppState } from "@/lib/store/app-store";

/** Empty for now — seeded with mock data and actions in Phase 1. */
export type CampsSlice = {
  camps: HealthCamp[];
};

export const createCampsSlice: StateCreator<
  AppState,
  [["zustand/persist", unknown]],
  [],
  CampsSlice
> = () => ({
  camps: [],
});
