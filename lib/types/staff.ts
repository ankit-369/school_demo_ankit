import type { ClassKey } from "./grade";

export type StaffRole = "principal" | "admin" | "teacher" | "nurse" | "registrar";

export type StaffStatus = "active" | "on-leave" | "inactive";

export type Staff = {
  id: string;
  name: string;
  role: StaffRole;
  department: string;
  email: string;
  phone: string;
  assignedClasses: ClassKey[];
  status: StaffStatus;
};
