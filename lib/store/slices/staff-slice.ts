import { defaultPermissions, PERMISSIONS } from "@/lib/data/permissions";
import type { ClassKey } from "@/lib/types/grade";
import type { PermissionKey } from "@/lib/types/permission";
import type { Staff, StaffStatus } from "@/lib/types/staff";
import { newId } from "../helpers";
import type { SliceCreator } from "../state";

export type NewStaffInput = Omit<Staff, "id" | "status" | "permissions"> & { status?: StaffStatus };

export type StaffSlice = {
  staff: Staff[];
  /** New staff start with their role's default permissions. */
  addStaff: (input: NewStaffInput) => string;
  updateStaff: (id: string, patch: Partial<Omit<Staff, "id" | "permissions">>, reason?: string) => void;
  setStaffStatus: (id: string, status: StaffStatus, reason: string) => void;
  setStaffPermission: (id: string, key: PermissionKey, granted: boolean) => void;
  resetStaffPermissions: (id: string) => void;
  setAssignedClasses: (id: string, classes: ClassKey[]) => void;
};

const labelOf = (key: PermissionKey) => PERMISSIONS.find((p) => p.key === key)?.label ?? key;

export const createStaffSlice: SliceCreator<StaffSlice> = (set, get) => {
  const replace = (id: string, fn: (s: Staff) => Staff) =>
    set((state) => ({ staff: state.staff.map((s) => (s.id === id ? fn(s) : s)) }));
  const nameOf = (id: string) => get().staff.find((s) => s.id === id)?.name ?? id;

  return {
    staff: [],

    addStaff: ({ status = "active", ...input }) => {
      const id = newId("stf");
      set((s) => ({ staff: [...s.staff, { ...input, id, status, permissions: defaultPermissions(input.role) }] }));
      get().logAudit("staff.created", input.name, `Role: ${input.role}`);
      return id;
    },

    updateStaff: (id, patch, reason = "") => {
      replace(id, (s) => ({ ...s, ...patch }));
      get().logAudit("staff.updated", nameOf(id), reason);
    },

    setStaffStatus: (id, status, reason) => {
      replace(id, (s) => ({ ...s, status }));
      get().logAudit(`staff.${status}`, nameOf(id), reason);
    },

    setStaffPermission: (id, key, granted) => {
      replace(id, (s) => ({ ...s, permissions: { ...s.permissions, [key]: granted } }));
      get().logAudit(granted ? "permission.granted" : "permission.revoked", nameOf(id), labelOf(key));
    },

    resetStaffPermissions: (id) => {
      replace(id, (s) => ({ ...s, permissions: defaultPermissions(s.role) }));
      get().logAudit("permission.reset", nameOf(id), "Restored role defaults");
    },

    setAssignedClasses: (id, classes) => {
      replace(id, (s) => ({ ...s, assignedClasses: classes }));
      get().logAudit("staff.classes-assigned", nameOf(id), classes.join(", ") || "None");
    },
  };
};
