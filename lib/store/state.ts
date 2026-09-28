import type { StateCreator } from "zustand";
import type { AuditLogEntry } from "@/lib/types/audit-log";
import type { Camp } from "@/lib/types/camp";
import type { ClinicalNote } from "@/lib/types/clinical-note";
import type { ConsentRecord } from "@/lib/types/consent";
import type { Notification } from "@/lib/types/notification";
import type { Report } from "@/lib/types/report";
import type { Staff } from "@/lib/types/staff";
import type { Student } from "@/lib/types/student";
import type { AcademicSlice } from "./slices/academic-slice";
import type { AuditSlice } from "./slices/audit-slice";
import type { CampsSlice } from "./slices/camps-slice";
import type { ConsentSlice } from "./slices/consent-slice";
import type { HfilesSlice } from "./slices/hfiles-slice";
import type { NotesSlice } from "./slices/notes-slice";
import type { SettingsSlice } from "./slices/settings-slice";
import type { NotificationsSlice } from "./slices/notifications-slice";
import type { ReportsSlice } from "./slices/reports-slice";
import type { StaffSlice } from "./slices/staff-slice";
import type { StudentsSlice } from "./slices/students-slice";
import type { UiSlice } from "./slices/ui-slice";

/** Every persisted collection — exactly what the seed produces and resetDemoData restores. */
export type DemoData = {
  students: Student[];
  staff: Staff[];
  camps: Camp[];
  notes: ClinicalNote[];
  reports: Report[];
  notifications: Notification[];
  consents: ConsentRecord[];
  auditLog: AuditLogEntry[];
};

export type AppState = UiSlice &
  AcademicSlice &
  StudentsSlice &
  StaffSlice &
  CampsSlice &
  ReportsSlice &
  NotesSlice &
  NotificationsSlice &
  ConsentSlice &
  HfilesSlice &
  SettingsSlice &
  AuditSlice;

export type SliceCreator<T> = StateCreator<AppState, [["zustand/persist", unknown]], [], T>;
