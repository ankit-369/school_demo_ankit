import type { Staff, StaffStatus } from "@/lib/types/staff";
import { newId } from "../helpers";
import type { SliceCreator } from "../state";

export type NewStaffInput = Omit<Staff, "id" | "status"> & { status?: StaffStatus };

export type StaffSlice = {
  staff: Staff[];
  addStaff: (input: NewStaffInput) => string;
  updateStaff: (id: string, patch: Partial<Omit<Staff, "id">>, reason?: string) => void;
  setStaffStatus: (id: string, status: StaffStatus, reason: string) => void;
};

export const createStaffSlice: SliceCreator<StaffSlice> = (set, get) => {
  const replace = (id: string, fn: (s: Staff) => Staff) =>
    set((state) => ({ staff: state.staff.map((s) => (s.id === id ? fn(s) : s)) }));
  const nameOf = (id: string) => get().staff.find((s) => s.id === id)?.name ?? id;

  return {
    staff: [],

    addStaff: ({ status = "active", ...input }) => {
      const id = newId("stf");
      set((s) => ({ staff: [...s.staff, { ...input, id, status }] }));
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
  };
};
