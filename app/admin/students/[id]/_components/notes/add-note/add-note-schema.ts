import { z } from "zod";

export const addNoteSchema = z.object({
  type: z.enum(["incident", "general", "screening"]),
  urgent: z.boolean(),
  reason: z.string().trim().min(3, "Say why they visited — it opens the guardian's message"),
  actionTaken: z.string().trim().min(3, "Say what was done"),
  suggestion: z.string().trim(),
  notes: z.string().trim(),
});

export type AddNoteValues = z.infer<typeof addNoteSchema>;

export const ADD_NOTE_DEFAULTS: AddNoteValues = {
  type: "general",
  urgent: false,
  reason: "",
  actionTaken: "",
  suggestion: "",
  notes: "",
};
