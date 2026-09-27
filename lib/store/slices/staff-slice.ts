import type { StateCreator } from "zustand";
import type { StaffMember } from "@/lib/types/staff";
import type { AppState } from "@/lib/store/app-store";

/** Empty for now — seeded with mock data and actions in Phase 1. */
export type StaffSlice = {
  staff: StaffMember[];
};

export const createStaffSlice: StateCreator<
  AppState,
  [["zustand/persist", unknown]],
  [],
  StaffSlice
> = () => ({
  staff: [],
});
