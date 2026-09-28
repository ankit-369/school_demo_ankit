/**
 * Classroom action plans shown to teachers. Demo content modelled on common
 * school first-aid guidance — a real deployment would use each student's
 * signed care plan from the nurse or family doctor.
 */
export type Severity = "emergency" | "urgent" | "routine";

export type ActionPlan = {
  severity: Severity;
  /** What this is, in plain words. */
  summary: string;
  signs: string[];
  steps: string[];
};

const ANAPHYLAXIS: ActionPlan = {
  severity: "emergency",
  summary: "Severe food allergy — risk of anaphylaxis",
  signs: ["Swelling of lips, face or tongue", "Hives or widespread rash", "Difficulty breathing, wheeze or hoarse voice", "Vomiting, dizziness or collapse"],
  steps: [
    "Stay with the student. Do not let them walk to the medical room.",
    "If breathing, voice or consciousness is affected, use their EpiPen in the outer thigh now.",
    "Call an ambulance (108), then the school nurse.",
    "Lay them flat with legs raised — or sitting up if breathing is hard.",
    "Call the guardian. A second EpiPen can be given after 5 minutes if there's no improvement.",
  ],
};

const MEDICATION: ActionPlan = {
  severity: "urgent",
  summary: "Medication allergy",
  signs: ["Rash or hives after a medicine", "Swelling or itching"],
  steps: ["Never give any medicine in class — send the student to the nurse.", "Tell any visiting doctor about this allergy.", "If breathing is affected, treat as an emergency: call 108 and the nurse."],
};

const SEASONAL: ActionPlan = {
  severity: "routine",
  summary: "Mild environmental allergy",
  signs: ["Sneezing, runny nose", "Itchy or watery eyes"],
  steps: ["Keep windows closed on high-pollen days if possible.", "Send to the nurse if symptoms stop them working — they may need an antihistamine."],
};

const PLANS: Record<string, ActionPlan> = {
  peanuts: ANAPHYLAXIS,
  "tree nuts": ANAPHYLAXIS,
  shellfish: ANAPHYLAXIS,
  penicillin: MEDICATION,
  "sulfa drugs": MEDICATION,
  latex: { ...MEDICATION, summary: "Latex allergy", steps: ["Avoid latex gloves and balloons in class activities.", "Send to the nurse if a rash appears."] },
  pollen: SEASONAL,
  "dust mites": SEASONAL,
  asthma: {
    severity: "urgent",
    summary: "Asthma",
    signs: ["Coughing or wheezing", "Tight chest, short of breath", "Can't finish a sentence"],
    steps: ["Sit them upright and keep calm — don't lie them down.", "Help them take 2 puffs of their reliever inhaler (blue).", "If no better in 5 minutes, repeat and call the nurse.", "If lips go blue or they can't speak, call 108."],
  },
  "type 1 diabetes": {
    severity: "urgent",
    summary: "Type 1 diabetes — watch for low blood sugar",
    signs: ["Shaky, pale or sweaty", "Confused, irritable or unusually quiet", "Headache or drowsiness"],
    steps: ["Give fast sugar now: glucose tablets, juice or 3–4 sweets.", "Keep them seated and with an adult — never send them alone.", "Call the nurse to check their blood glucose.", "If they become unconscious, put them in the recovery position and call 108."],
  },
  epilepsy: {
    severity: "emergency",
    summary: "Epilepsy — seizure first aid",
    signs: ["Sudden stiffening and jerking", "Staring spell, unresponsive"],
    steps: ["Time the seizure. Move furniture away; cushion their head.", "Do not restrain them or put anything in their mouth.", "When jerking stops, roll them onto their side.", "Call 108 if it lasts over 5 minutes or they're injured. Call the nurse and guardian."],
  },
  migraine: {
    severity: "routine",
    summary: "Migraine",
    signs: ["Headache, sensitivity to light", "Nausea"],
    steps: ["Let them rest somewhere quiet and dim.", "Send to the nurse — medicine only with guardian consent on file."],
  },
  eczema: { severity: "routine", summary: "Eczema", signs: ["Dry, itchy, red patches"], steps: ["Allow them to use their own moisturiser.", "Avoid craft materials that irritate their skin."] },
  adhd: { severity: "routine", summary: "ADHD — learning support", signs: [], steps: ["Follow the classroom support plan (extra time, movement breaks).", "No medical action needed in class."] },
};

const FALLBACK: ActionPlan = { severity: "routine", summary: "Noted health condition", signs: [], steps: ["Check with the school nurse if you're unsure what to do."] };

export function actionPlanFor(label: string): ActionPlan {
  return PLANS[label.trim().toLowerCase()] ?? FALLBACK;
}

export const SEVERITY_ORDER: Record<Severity, number> = { emergency: 0, urgent: 1, routine: 2 };

export const EMERGENCY_NUMBER = "108";
