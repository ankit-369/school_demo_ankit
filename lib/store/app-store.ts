"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { defaultPermissions } from "@/lib/data/permissions";
import { DEFAULT_TEMPLATES } from "@/lib/data/templates";
import { DEFAULT_SCHOOL as DEFAULT_SCHOOL_FALLBACK } from "./slices/settings-slice";
import { createSeedData } from "@/lib/data/seed";
import { seedDoctorLinks } from "@/lib/data/seed/doctor-links";
import { createAcademicSlice } from "./slices/academic-slice";
import { createAuditSlice } from "./slices/audit-slice";
import { createCampsSlice } from "./slices/camps-slice";
import { createConsentSlice } from "./slices/consent-slice";
import { createDoctorLinksSlice } from "./slices/doctor-links-slice";
import { createHfilesSlice } from "./slices/hfiles-slice";
import { createNotesSlice } from "./slices/notes-slice";
import { createSettingsSlice } from "./slices/settings-slice";
import { createNotificationsSlice } from "./slices/notifications-slice";
import { createReportsSlice } from "./slices/reports-slice";
import { createStaffSlice } from "./slices/staff-slice";
import { createStudentsSlice } from "./slices/students-slice";
import { createUiSlice } from "./slices/ui-slice";
import type { AppState, DemoData } from "./state";

export type { AppState, DemoData } from "./state";

const STORE_VERSION = 7;

type PersistedState = DemoData & Pick<AppState, "role" | "academicYear" | "school" | "templates">;

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
      ...createAcademicSlice(...a),
      ...createStudentsSlice(...a),
      ...createStaffSlice(...a),
      ...createCampsSlice(...a),
      ...createReportsSlice(...a),
      ...createNotesSlice(...a),
      ...createNotificationsSlice(...a),
      ...createConsentSlice(...a),
      ...createHfilesSlice(...a),
      ...createDoctorLinksSlice(...a),
      ...createSettingsSlice(...a),
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
        academicYear: s.academicYear,
        school: s.school,
        templates: s.templates,
        students: s.students,
        staff: s.staff,
        camps: s.camps,
        notes: s.notes,
        reports: s.reports,
        notifications: s.notifications,
        consents: s.consents,
        auditLog: s.auditLog,
        doctorLinks: s.doctorLinks,
      }),
      migrate: (persisted, version) => {
        let state = persisted as PersistedState;
        // v0–1 (Phase 0) stored only the role: reseed everything.
        if (version < 2) return { ...createSeedData(), role: state?.role ?? "admin" };
        // v2 → v3: staff gained permissions; keep the user's data, add role defaults.
        if (version < 3) {
          state = { ...state, staff: state.staff.map((s) => ({ ...s, permissions: s.permissions ?? defaultPermissions(s.role) })) };
        }
        // v3 → v4: added school profile and notification templates.
        if (version < 4) {
          state = { ...state, school: state.school ?? DEFAULT_SCHOOL_FALLBACK, templates: state.templates ?? DEFAULT_TEMPLATES };
        }
        // v4 → v5: permission keys added since a user's data was saved (manageSettings,
        // logIncidents) default from the role; demo doctor links are added.
        if (version < 5) {
          state = {
            ...state,
            staff: state.staff.map((s) => ({ ...s, permissions: { ...defaultPermissions(s.role), ...s.permissions } })),
            doctorLinks: state.doctorLinks ?? seedDoctorLinks,
          };
        }
        // v5 → v6: the school's name/phone/email went generic and clinical notes
        // gained a pending/notified/not-needed guardian workflow — both reshape
        // seed data enough that a clean reseed beats patching the old shape.
        if (version < 6) return { ...createSeedData(), role: state?.role ?? "admin", academicYear: "2026-27", school: DEFAULT_SCHOOL_FALLBACK, templates: { ...DEFAULT_TEMPLATES } };
        // v6 → v7: students gained an emergency contact, mother/father names and
        // family history; reports gained a doctor field — another clean reseed.
        if (version < 7) return { ...createSeedData(), role: state?.role ?? "admin", academicYear: "2026-27", school: DEFAULT_SCHOOL_FALLBACK, templates: { ...DEFAULT_TEMPLATES } };
        return state;
      },
    },
  ),
);
