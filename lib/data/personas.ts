import type { Role } from "@/lib/types/role";

/** Who is "acting" for each Viewing-as role; used as the audit/uploader name. */
export const ROLE_PERSONAS: Record<Role, string> = {
  admin: "Mr. Ankit Sharma",
  nurse: "Nurse Chloe Simm",
  teacher: "Ms. Helena Vance",
  doctor: "Dr. Sarah Jenkins",
};

/** The staff record each Viewing-as role acts as; null = not on staff (visiting doctor). */
export const ROLE_STAFF_IDS: Record<Role, string | null> = {
  admin: "stf-02",
  nurse: "stf-06",
  teacher: "stf-05",
  doctor: null,
};
