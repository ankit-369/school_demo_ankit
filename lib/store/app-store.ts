"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSeedData } from "@/lib/data/seed";
import { createAuditSlice } from "./slices/audit-slice";
import { createCampsSlice } from "./slices/camps-slice";
import { createConsentSlice } from "./slices/consent-slice";
import { createHfilesSlice } from "./slices/hfiles-slice";
import { createNotesSlice } from "./slices/notes-slice";
import { createNotificationsSlice } from "./slices/notifications-slice";
import { createReportsSlice } from "./slices/reports-slice";
import { createStaffSlice } from "./slices/staff-slice";
import { createStudentsSlice } from "./slices/students-slice";
import { createUiSlice } from "./slices/ui-slice";
import type { AppState, DemoData } from "./state";

export type { AppState, DemoData } from "./state";

const STORE_VERSION = 2;

type PersistedState = DemoData & Pick<AppState, "role">;

/**
 * The app's single mock "database", persisted to localStorage.
 * Components read with selectors and change data only through these actions.
 * Hydration is deferred (see <StoreHydrator />) so server and first client
 * render match — both start from the seed.
 */
export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createUiSlice(...a),
      ...createStudentsSlice(...a),
      ...createStaffSlice(...a),
      ...createCampsSlice(...a),
      ...createReportsSlice(...a),
      ...createNotesSlice(...a),
      ...createNotificationsSlice(...a),
      ...createConsentSlice(...a),
      ...createHfilesSlice(...a),
      ...createAuditSlice(...a),
      ...createSeedData(),
    }),
    {
      name: "healthconnect-db",
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s): PersistedState => ({
        role: s.role,
        students: s.students,
        staff: s.staff,
        camps: s.camps,
        notes: s.notes,
        reports: s.reports,
        notifications: s.notifications,
        consents: s.consents,
        auditLog: s.auditLog,
      }),
      // Phase 0 stored only the role; anything older than the current shape reseeds.
      migrate: (persisted, version) => {
        const role = (persisted as Partial<PersistedState> | undefined)?.role ?? "admin";
        return version < STORE_VERSION ? { ...createSeedData(), role } : (persisted as PersistedState);
      },
    },
  ),
);
