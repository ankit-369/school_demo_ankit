import { z } from "zod";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { GRADES } from "@/lib/types/grade";
import type { ScreeningType } from "@/lib/types/screening";

const SCREENING_TYPES = Object.keys(SCREENING_TYPE_LABELS) as [ScreeningType, ...ScreeningType[]];

export const screeningSchema = z.object({
  type: z.enum(SCREENING_TYPES, { error: "Select a screening" }),
  leadDoctor: z.string().trim().min(3, "Enter the lead doctor"),
  date: z.string().min(1, "Pick a date"),
  targetStandards: z.array(z.enum(GRADES)).min(1, "Pick at least one class"),
});

export type ScreeningValues = z.infer<typeof screeningSchema>;

export const campSchema = z
  .object({
    name: z.string().trim().min(3, "Give the camp a name"),
    startDate: z.string().min(1, "Pick a start date"),
    endDate: z.string().min(1, "Pick an end date"),
    screenings: z.array(screeningSchema).min(1, "Add at least one screening"),
  })
  .superRefine((v, ctx) => {
    if (v.startDate && v.endDate && v.endDate < v.startDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date must be on or after the start date" });
    }
    v.screenings.forEach((s, i) => {
      if (s.date && v.startDate && v.endDate && (s.date < v.startDate || s.date > v.endDate)) {
        ctx.addIssue({ code: "custom", path: ["screenings", i, "date"], message: "Must fall within the camp dates" });
      }
    });
  });

export type CampValues = z.infer<typeof campSchema>;

export const EMPTY_SCREENING: Partial<ScreeningValues> = { leadDoctor: "", date: "", targetStandards: [] };

export const CAMP_DEFAULTS: Partial<CampValues> = {
  name: "",
  startDate: "",
  endDate: "",
  screenings: [EMPTY_SCREENING as ScreeningValues],
};

export { SCREENING_TYPES };
