/**
 * A no-login access link for an external doctor, scoped to one screening.
 * In a real system the token would be a signed, single-purpose secret; here it's mock data.
 */
export type DoctorLink = {
  token: string;
  campId: string;
  screeningId: string;
  doctorName: string;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
};

export type DoctorLinkCheck =
  | { ok: true; link: DoctorLink }
  | { ok: false; reason: "not-found" | "expired" | "revoked" | "screening-missing" };
