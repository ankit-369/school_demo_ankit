import { DEFAULT_SCHOOL_NAME, DEMO_EMAIL_DOMAIN, formatPhone } from "@/lib/config";
import { DEFAULT_TEMPLATES } from "@/lib/data/templates";
import type { NotificationTemplates, SchoolProfile, TemplateKey } from "@/lib/types/settings";
import type { SliceCreator } from "../state";

export const DEFAULT_SCHOOL: SchoolProfile = {
  name: DEFAULT_SCHOOL_NAME,
  address: "Vasna-Bhayli Road, Vadodara, Gujarat 391410",
  phone: formatPhone(),
  email: `admin@${DEMO_EMAIL_DOMAIN}`,
};

export type SettingsSlice = {
  school: SchoolProfile;
  templates: NotificationTemplates;
  updateSchoolProfile: (patch: Partial<SchoolProfile>) => void;
  updateTemplate: (key: TemplateKey, value: string) => void;
  resetTemplate: (key: TemplateKey) => void;
};

export const createSettingsSlice: SliceCreator<SettingsSlice> = (set, get) => ({
  school: DEFAULT_SCHOOL,
  templates: { ...DEFAULT_TEMPLATES },

  updateSchoolProfile: (patch) => {
    set((s) => ({ school: { ...s.school, ...patch } }));
    get().logAudit("settings.school-profile-updated", get().school.name, Object.keys(patch).join(", "));
  },

  updateTemplate: (key, value) => {
    set((s) => ({ templates: { ...s.templates, [key]: value } }));
    get().logAudit("settings.template-updated", key);
  },

  resetTemplate: (key) => {
    set((s) => ({ templates: { ...s.templates, [key]: DEFAULT_TEMPLATES[key] } }));
    get().logAudit("settings.template-reset", key);
  },
});
