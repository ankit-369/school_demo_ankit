import { z } from "zod";

export const addNoteSchema = z
  .object({
    type: z.enum(["incident", "general", "screening"]),
    notes: z.string().trim(),
    urgent: z.boolean(),
    notifyGuardian: z.boolean(),
    channel: z.enum(["whatsapp", "sms"]),
    reason: z.string().trim(),
    actionTaken: z.string().trim(),
    suggestion: z.string().trim(),
  })
  .superRefine((v, ctx) => {
    if (v.notifyGuardian) {
      if (v.reason.length < 3) ctx.addIssue({ code: "custom", path: ["reason"], message: "Say why they visited — it opens the guardian's message" });
      if (v.actionTaken.length < 3) ctx.addIssue({ code: "custom", path: ["actionTaken"], message: "Say what was done" });
    } else if (v.notes.length < 3) {
      ctx.addIssue({ code: "custom", path: ["notes"], message: "Add a clinical note" });
    }
  });

export type AddNoteValues = z.infer<typeof addNoteSchema>;

export const ADD_NOTE_DEFAULTS: AddNoteValues = {
  type: "general",
  notes: "",
  urgent: false,
  notifyGuardian: true,
  channel: "whatsapp",
  reason: "",
  actionTaken: "",
  suggestion: "",
};
