import { z } from "zod";

export const STAFF_ROLES = ["principal", "admin", "teacher", "nurse", "registrar"] as const;

export const addFacultySchema = z.object({
  name: z.string().trim().min(2, "Enter the full name"),
  role: z.enum(STAFF_ROLES, { error: "Select a role" }),
  department: z.string().trim().min(2, "Enter a department"),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().regex(/^\+?[\d\s-]{10,16}$/, "Enter a valid phone number, e.g. +91 98200 12345"),
  status: z.enum(["active", "on-leave", "inactive"]),
  assignedClasses: z.array(z.string()),
});

export type AddFacultyValues = z.infer<typeof addFacultySchema>;

export const ADD_FACULTY_DEFAULTS: Partial<AddFacultyValues> = {
  name: "",
  department: "",
  email: "",
  phone: "",
  status: "active",
  assignedClasses: [],
};
