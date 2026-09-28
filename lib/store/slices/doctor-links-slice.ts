import type { DoctorLink, DoctorLinkCheck } from "@/lib/types/doctor-link";
import type { ScreeningResultStatus } from "@/lib/types/screening";
import { nowIso } from "../helpers";
import type { AppState, SliceCreator } from "../state";

export type DoctorResultInput = { studentId: string; status: ScreeningResultStatus; notes: string };

export type DoctorLinksSlice = {
  doctorLinks: DoctorLink[];
  /** Creates (or returns the existing live) link for a screening; returns the token. */
  createDoctorLink: (campId: string, screeningId: string) => string;
  revokeDoctorLink: (token: string) => void;
  /** Token-checked write into the same ScreeningResult data the admin sees; audited as the doctor. */
  submitDoctorResult: (token: string, input: DoctorResultInput) => DoctorLinkCheck;
};

/** Pure check, shared by the doctor page (to render) and the store (to authorise writes). */
export function checkDoctorLink(state: Pick<AppState, "doctorLinks" | "camps">, token: string, now = new Date()): DoctorLinkCheck {
  const link = state.doctorLinks.find((l) => l.token === token);
  if (!link) return { ok: false, reason: "not-found" };
  if (link.revoked) return { ok: false, reason: "revoked" };
  if (new Date(link.expiresAt) < now) return { ok: false, reason: "expired" };
  const camp = state.camps.find((c) => c.id === link.campId);
  if (!camp?.screenings.some((s) => s.id === link.screeningId)) return { ok: false, reason: "screening-missing" };
  return { ok: true, link };
}

function newToken() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 16 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export const createDoctorLinksSlice: SliceCreator<DoctorLinksSlice> = (set, get) => ({
  doctorLinks: [],

  createDoctorLink: (campId, screeningId) => {
    const existing = get().doctorLinks.find((l) => l.screeningId === screeningId && checkDoctorLink(get(), l.token).ok);
    if (existing) return existing.token;
    const camp = get().camps.find((c) => c.id === campId);
    const screening = camp?.screenings.find((s) => s.id === screeningId);
    if (!camp || !screening) throw new Error("Unknown screening");
    const expires = new Date(`${camp.endDate}T23:59:59`);
    expires.setDate(expires.getDate() + 14);
    const link: DoctorLink = {
      token: newToken(),
      campId,
      screeningId,
      doctorName: screening.leadDoctor,
      createdAt: nowIso(),
      expiresAt: expires.toISOString(),
      revoked: false,
    };
    set((s) => ({ doctorLinks: [...s.doctorLinks, link] }));
    get().logAudit("camp.doctor-link-created", `${camp.name} · ${screening.leadDoctor}`, "Expires 14 days after the camp ends");
    return link.token;
  },

  revokeDoctorLink: (token) => {
    const link = get().doctorLinks.find((l) => l.token === token);
    set((s) => ({ doctorLinks: s.doctorLinks.map((l) => (l.token === token ? { ...l, revoked: true } : l)) }));
    if (link) get().logAudit("camp.doctor-link-revoked", link.doctorName);
  },

  submitDoctorResult: (token, { studentId, status, notes }) => {
    const check = checkDoctorLink(get(), token);
    if (!check.ok) return check;
    const { link } = check;
    const screening = get().camps.find((c) => c.id === link.campId)!.screenings.find((s) => s.id === link.screeningId)!;
    const student = get().students.find((s) => s.id === studentId);
    const inScope = student && (screening.results.some((r) => r.studentId === studentId) || screening.targetStandards.includes(student.grade));
    if (!inScope) return { ok: false, reason: "not-found" };

    get().recordScreeningResult(link.campId, link.screeningId, {
      studentId,
      status,
      notes: notes.trim(),
      ...(status !== "pending" && { reportUrl: `/reports/${link.screeningId}/${studentId}.pdf` }),
    });
    get().logAudit("camp.result-recorded", student.name, `Via doctor link · ${status}`, link.doctorName);
    return check;
  },
});
