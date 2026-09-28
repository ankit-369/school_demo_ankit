import { z } from "zod";

export const INCIDENT_KINDS = [
  { value: "injury", label: "Injury (fall, cut, bump)" },
  { value: "unwell", label: "Feeling unwell" },
  { value: "allergic", label: "Allergic reaction" },
  { value: "breathing", label: "Breathing difficulty / asthma" },
  { value: "seizure", label: "Seizure" },
  { value: "other", label: "Other" },
] as const;

type Kind = (typeof INCIDENT_KINDS)[number]["value"];

export const incidentSchema = z.object({
  studentId: z.string().min(1, "Choose the student"),
  kind: z.enum(INCIDENT_KINDS.map((k) => k.value) as [Kind, ...Kind[]], { error: "Choose what happened" }),
  details: z.string().trim().min(5, "Describe what happened in a few words"),
  actionTaken: z.string().trim().min(3, "Say what you did"),
  nurseFollowUp: z.boolean(),
});

export type IncidentValues = z.infer<typeof incidentSchema>;

export function composeIncidentNote(v: IncidentValues) {
  const kind = INCIDENT_KINDS.find((k) => k.value === v.kind)?.label ?? "Incident";
  const clean = (t: string) => t.trim().replace(/[.\s]+$/, "");
  return `Classroom incident — ${kind}. ${clean(v.details)}. Action taken: ${clean(v.actionTaken)}.${v.nurseFollowUp ? " Nurse follow-up requested." : ""}`;
}
