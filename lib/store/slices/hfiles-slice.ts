import { localDateString } from "@/lib/format";
import { HFILES_IMMUNIZATION_POOL, HFILES_LAB_POOL } from "@/lib/data/hfiles-pool";
import { SCREENING_TYPE_LABELS } from "@/lib/labels";
import { newId, nowIso } from "../helpers";
import type { SliceCreator } from "../state";

export type HfilesSlice = {
  /**
   * Mock pull from hfiles.in: adds up to one new immunization and one new lab
   * report the student doesn't have yet, and stamps lastSyncedAt.
   * Returns how many new records arrived.
   */
  syncFromHfiles: (studentId: string) => number;
  /**
   * Pushes one screening's results to each listed student's hfiles.in record:
   * adds (or refreshes) a lab-report entry and stamps lastSyncedAt. Returns how many were sent.
   */
  sendScreeningResultsToHfiles: (campId: string, screeningId: string, studentIds: string[]) => number;
};

export const createHfilesSlice: SliceCreator<HfilesSlice> = (set, get) => ({
  syncFromHfiles: (studentId) => {
    const student = get().students.find((s) => s.id === studentId);
    if (!student) return 0;
    const now = nowIso();
    const today = localDateString();
    const { hfiles } = student.medicalHistory;

    const imm = HFILES_IMMUNIZATION_POOL.find(
      (p) => !hfiles.immunizations.some((i) => i.vaccine === p.vaccine && i.dose === p.dose),
    );
    const lab = HFILES_LAB_POOL.find((p) => !hfiles.labReports.some((l) => l.name === p.name));

    const next = {
      ...hfiles,
      immunizations: imm ? [{ ...imm, id: newId("imm"), date: today }, ...hfiles.immunizations] : hfiles.immunizations,
      labReports: lab ? [{ ...lab, id: newId("lab"), date: today }, ...hfiles.labReports] : hfiles.labReports,
      lastSyncedAt: now,
    };

    set((s) => ({
      students: s.students.map((st) =>
        st.id === studentId ? { ...st, medicalHistory: { ...st.medicalHistory, hfiles: next } } : st,
      ),
    }));
    const added = Number(Boolean(imm)) + Number(Boolean(lab));
    get().logAudit("hfiles.synced", student.name, `${added} new records`);
    return added;
  },

  sendScreeningResultsToHfiles: (campId, screeningId, studentIds) => {
    const camp = get().camps.find((c) => c.id === campId);
    const screening = camp?.screenings.find((s) => s.id === screeningId);
    if (!camp || !screening) return 0;
    const ids = new Set(studentIds);
    const now = nowIso();
    const title = `${SCREENING_TYPE_LABELS[screening.type]} — ${camp.name}`;

    set((s) => ({
      students: s.students.map((st) => {
        if (!ids.has(st.id)) return st;
        const result = screening.results.find((r) => r.studentId === st.id);
        const entryId = `lab-${screeningId}-${st.id}`;
        const entry = {
          id: entryId,
          name: title,
          date: screening.date,
          lab: screening.leadDoctor,
          summary: result?.notes || "Screening completed at school.",
          sharedAt: now,
        };
        const { hfiles } = st.medicalHistory;
        const labReports = [entry, ...hfiles.labReports.filter((l) => l.id !== entryId)];
        return { ...st, medicalHistory: { ...st.medicalHistory, hfiles: { ...hfiles, labReports, lastSyncedAt: now } } };
      }),
    }));
    get().logAudit("hfiles.results-sent", title, `${ids.size} students`);
    return ids.size;
  },
});
