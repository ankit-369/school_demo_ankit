import { DEMO_EMAIL_DOMAIN, formatPhone } from "@/lib/config";
import { defaultPermissions } from "@/lib/data/permissions";
import type { Staff } from "@/lib/types/staff";

export const STAFF_IDS = {
  principal: "stf-01",
  admin: "stf-02",
  primaryTeacher: "stf-03",
  middleTeacher: "stf-04",
  seniorTeacher: "stf-05",
  headNurse: "stf-06",
  nurse: "stf-07",
  registrar: "stf-08",
} as const;

const staffSeeds: Omit<Staff, "permissions">[] = [
  {
    id: STAFF_IDS.principal,
    name: "Dr. Kavita Rao",
    role: "principal",
    department: "Administration",
    email: `kavita.rao@${DEMO_EMAIL_DOMAIN}`,
    phone: formatPhone(),
    assignedClasses: [],
    status: "active",
  },
  {
    id: STAFF_IDS.admin,
    name: "Mr. Ankit Sharma",
    role: "admin",
    department: "Administration",
    email: `ankit.sharma@${DEMO_EMAIL_DOMAIN}`,
    phone: formatPhone(),
    assignedClasses: [],
    status: "active",
  },
  {
    id: STAFF_IDS.primaryTeacher,
    name: "Ms. Priya Nair",
    role: "teacher",
    department: "Pre-primary & Primary",
    email: `priya.nair@${DEMO_EMAIL_DOMAIN}`,
    phone: formatPhone(),
    assignedClasses: ["JKG-A", "SKG-A", "1-A", "2-B", "3-A"],
    status: "active",
  },
  {
    id: STAFF_IDS.middleTeacher,
    name: "Mr. Rohan Kapoor",
    role: "teacher",
    department: "Middle School",
    email: `rohan.kapoor@${DEMO_EMAIL_DOMAIN}`,
    phone: formatPhone(),
    assignedClasses: ["4-A", "5-B", "6-A", "7-A"],
    status: "active",
  },
  {
    id: STAFF_IDS.seniorTeacher,
    name: "Ms. Helena Vance",
    role: "teacher",
    department: "Senior School",
    email: `helena.vance@${DEMO_EMAIL_DOMAIN}`,
    phone: formatPhone(),
    assignedClasses: ["8-B", "9-A", "10-A", "11-A", "12-A"],
    status: "active",
  },
  {
    id: STAFF_IDS.headNurse,
    name: "Nurse Chloe Simm",
    role: "nurse",
    department: "Health Centre",
    email: `chloe.simm@${DEMO_EMAIL_DOMAIN}`,
    phone: formatPhone(),
    assignedClasses: [],
    status: "active",
  },
  {
    id: STAFF_IDS.nurse,
    name: "Nurse Farah Siddiqui",
    role: "nurse",
    department: "Health Centre",
    email: `farah.siddiqui@${DEMO_EMAIL_DOMAIN}`,
    phone: formatPhone(),
    assignedClasses: [],
    status: "on-leave",
  },
  {
    id: STAFF_IDS.registrar,
    name: "Mr. Vikram Bose",
    role: "registrar",
    department: "Admissions",
    email: `vikram.bose@${DEMO_EMAIL_DOMAIN}`,
    phone: formatPhone(),
    assignedClasses: [],
    status: "active",
  },
];

export const seedStaff: Staff[] = staffSeeds.map((s) => ({ ...s, permissions: defaultPermissions(s.role) }));
