import { capitalize, firstName } from "@/lib/format";

export type GuardianMessageParts = {
  reason: string;
  actionTaken: string;
  suggestion: string;
};

const clean = (text: string) => text.trim().replace(/[.\s]+$/, "");

/** Lower-cases a leading capital unless it looks like an acronym ("ENT", "BP"). */
function softLower(text: string) {
  return /^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

/**
 * The guardian SMS/WhatsApp text. Used by both the live preview and the
 * store, so what staff see is exactly what gets sent.
 */
export function composeGuardianMessage(studentName: string, parts: GuardianMessageParts) {
  const reason = clean(parts.reason);
  const sentences = [
    reason && `${firstName(studentName)} visited the medical room today for ${softLower(reason)}`,
    clean(parts.actionTaken) && capitalize(clean(parts.actionTaken)),
    clean(parts.suggestion) && capitalize(clean(parts.suggestion)),
  ].filter(Boolean);
  return sentences.length ? `${sentences.join(". ")}.` : "";
}
