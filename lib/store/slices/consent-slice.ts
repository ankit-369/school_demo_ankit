import { applyTemplate } from "@/lib/data/templates";
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
  /** Sends a WhatsApp reminder for one pending consent form; returns the notification id. */
  remindConsent: (id: string) => string | null;
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

  signConsent: (id) => {
    const record = get().consents.find((c) => c.id === id);
    set((s) => ({ consents: s.consents.map((c) => (c.id === id ? { ...c, status: "signed" } : c)) }));
    if (record) {
      const name = get().students.find((s) => s.id === record.studentId)?.name ?? record.studentId;
      get().logAudit("consent.signed", record.formName, name);
    }
  },

  remindConsent: (id) => {
    const record = get().consents.find((c) => c.id === id);
    if (!record || record.status !== "pending") return null;
    const student = get().students.find((s) => s.id === record.studentId);
    if (!student) return null;
    const message = applyTemplate(get().templates.consentReminder, {
      student: student.name,
      form: record.formName,
      school: get().school.name,
    });
    return get().sendNotification({ studentId: student.id, type: "consent-request", channel: "whatsapp", message, refId: id });
  },
});
