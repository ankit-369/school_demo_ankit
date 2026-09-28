export type Surgery = {
  id: string;
  name: string;
  date: string;
  hospital: string;
  outcome: "successful" | "complications" | "ongoing-care";
};

export type Immunization = {
  id: string;
  vaccine: string;
  dose: string;
  date: string;
  provider: string;
};

export type LabReport = {
  id: string;
  name: string;
  date: string;
  lab: string;
  summary: string;
  /** Set when the entry was auto-pushed from a school report upload. */
  reportId?: string;
  /** When the school pushed this entry to hfiles.in (screening results). */
  sharedAt?: string;
};

/** Entered and maintained by school staff. */
export type SchoolMedicalHistory = {
  allergies: string[];
  conditions: string[];
  surgeries: Surgery[];
  notes: string;
};

/** Synced from the family's hfiles.in record. Rendered in teal everywhere. */
export type HfilesMedicalHistory = {
  allergies: string[];
  immunizations: Immunization[];
  labReports: LabReport[];
  /** null = this student has never been synced with hfiles.in. */
  lastSyncedAt: string | null;
};

export type MedicalHistory = {
  school: SchoolMedicalHistory;
  hfiles: HfilesMedicalHistory;
};
