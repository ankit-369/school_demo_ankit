import type { Role } from "@/lib/types/role";

/** Who is "acting" for each Viewing-as role; used as the audit/uploader name. */
export const ROLE_PERSONAS: Record<Role, string> = {
  admin: "Mr. Ankit Sharma",
  nurse: "Nurse Chloe Simm",
  teacher: "Ms. Helena Vance",
  doctor: "Dr. Sarah Jenkins",
};
