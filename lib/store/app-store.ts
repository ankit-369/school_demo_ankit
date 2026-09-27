"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSessionSlice, type SessionSlice } from "./slices/session-slice";
import { createStudentsSlice, type StudentsSlice } from "./slices/students-slice";
import { createCampsSlice, type CampsSlice } from "./slices/camps-slice";
import { createStaffSlice, type StaffSlice } from "./slices/staff-slice";

export type AppState = SessionSlice & StudentsSlice & CampsSlice & StaffSlice;

/**
 * The app's single mock "database", persisted to localStorage.
 * Hydration is deferred (see <StoreHydrator />) so server and first client
 * render match.
 */
export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createSessionSlice(...a),
      ...createStudentsSlice(...a),
      ...createCampsSlice(...a),
      ...createStaffSlice(...a),
    }),
    {
      name: "healthconnect-db",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ role, students, camps, staff }) => ({ role, students, camps, staff }),
    },
  ),
);
