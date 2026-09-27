import type { StateCreator } from "zustand";
import type { Student } from "@/lib/types/student";
import type { AppState } from "@/lib/store/app-store";

/** Empty for now — seeded with mock data and actions in Phase 1. */
export type StudentsSlice = {
  students: Student[];
};

export const createStudentsSlice: StateCreator<
  AppState,
  [["zustand/persist", unknown]],
  [],
  StudentsSlice
> = () => ({
  students: [],
});
