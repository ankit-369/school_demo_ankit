import type { ScreeningType } from "@/lib/types/screening";

/** One-tap findings for the camp-day result form, per screening type. */
export const FINDING_PRESETS: Record<ScreeningType, string[]> = {
  vision: ["Snellen 6/6 both eyes", "Colour vision normal", "6/9 — refer for refraction", "Wears glasses; checked with glasses"],
  dental: ["Oral hygiene good", "Early caries — refer to dentist", "Gum inflammation", "Crowding — orthodontic consult"],
  hearing: ["Passed both ears", "Reduced response left ear", "Reduced response right ear", "Wax build-up — recheck"],
  anthropometry: ["Height and weight recorded", "BMI in healthy range", "BMI below range — dietary advice", "BMI above range — dietary advice"],
  general: ["Cardiovascular and respiratory exam normal", "Mild wheeze — review asthma plan", "Skin rash noted", "Refer to family doctor"],
  ent: ["Ears, nose, throat normal", "Enlarged tonsils", "Nasal congestion", "Ear infection — refer"],
};
