import type { DoctorLink } from "@/lib/types/doctor-link";
import { CAMP_IDS } from "./camps";

/**
 * Demo links for the in-progress Monsoon Wellness Check. Tokens are readable on
 * purpose so they're easy to type in a demo; the third one exercises the
 * "expired" state.
 */
export const seedDoctorLinks: DoctorLink[] = [
  {
    token: "demo-chen-general",
    campId: CAMP_IDS.inProgress,
    screeningId: `${CAMP_IDS.inProgress}-scr-2`,
    doctorName: "Dr. Robert Chen",
    createdAt: "2026-09-20T09:00:00Z",
    expiresAt: "2027-03-31T23:59:59Z",
    revoked: false,
  },
  {
    token: "demo-rodriguez-ent",
    campId: CAMP_IDS.inProgress,
    screeningId: `${CAMP_IDS.inProgress}-scr-3`,
    doctorName: "Dr. Elena Rodriguez",
    createdAt: "2026-09-20T09:00:00Z",
    expiresAt: "2027-03-31T23:59:59Z",
    revoked: false,
  },
  {
    token: "demo-expired",
    campId: CAMP_IDS.completed,
    screeningId: `${CAMP_IDS.completed}-scr-1`,
    doctorName: "Dr. Sarah Jenkins",
    createdAt: "2026-07-01T09:00:00Z",
    expiresAt: "2026-07-20T23:59:59Z",
    revoked: false,
  },
];
