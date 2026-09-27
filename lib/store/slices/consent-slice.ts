import type { ConsentRecord } from "@/lib/types/consent";
import { newId } from "../helpers";
import type { SliceCreator } from "../state";

export type RequestConsentInput = {
  formName: string;
  studentIds: string[];
  campId?: string;
};

export type ConsentSlice = {
  consents: ConsentRecord[];
  requestConsent: (input: RequestConsentInput) => void;
  signConsent: (id: string) => void;
};

export const createConsentSlice: SliceCreator<ConsentSlice> = (set, get) => ({
  consents: [],
  requestConsent: ({ formName, studentIds, campId }) => {
    const created: ConsentRecord[] = studentIds.map((studentId) => ({
      id: newId("cns"),
      formName,
      studentId,
      campId,
      status: "pending",
    }));
    set((s) => ({ consents: [...s.consents, ...created] }));
    get().logAudit("consent.requested", formName, `${studentIds.length} students`);
  },
  signConsent: (id) =>
    set((s) => ({
      consents: s.consents.map((c) => (c.id === id ? { ...c, status: "signed" } : c)),
    })),
});
