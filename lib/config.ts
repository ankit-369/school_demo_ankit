/**
 * Placeholder swapped for the real school's name right before a demo (Settings
 * -> School profile). Kept as the literal template string, curly braces and
 * all, so a forgotten swap is impossible to miss on screen.
 */
export const DEFAULT_SCHOOL_NAME = "{schoolname}";

/** Generic domain for demo-data staff emails — never a real school's domain. */
export const DEMO_EMAIL_DOMAIN = "school.edu.in";

/** One phone number, shared by every guardian, staff member and the school's own contact in demo data. */
export const DEMO_PHONE = "7621032612";

/** "7621032612" -> "+91 76210 32612" */
export function formatPhone(digits: string = DEMO_PHONE) {
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}
