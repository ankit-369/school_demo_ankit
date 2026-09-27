import type { Camp } from "@/lib/types/camp";
import type { Screening, ScreeningResult } from "@/lib/types/screening";
import { newId } from "../helpers";
import type { SliceCreator } from "../state";

export type NewScreeningInput = Omit<Screening, "id" | "campId" | "results">;

export type NewCampInput = Omit<Camp, "id" | "screenings"> & {
  screenings: NewScreeningInput[];
};

export type CampsSlice = {
  camps: Camp[];
  addCamp: (input: NewCampInput) => string;
  addScreening: (campId: string, input: NewScreeningInput) => string;
  /** Upserts one student's result for a screening. */
  recordScreeningResult: (campId: string, screeningId: string, result: ScreeningResult) => void;
};

function toScreening(campId: string, input: NewScreeningInput): Screening {
  return { ...input, id: newId("scr"), campId, results: [] };
}

export const createCampsSlice: SliceCreator<CampsSlice> = (set, get) => {
  const replaceCamp = (id: string, fn: (c: Camp) => Camp) =>
    set((state) => ({ camps: state.camps.map((c) => (c.id === id ? fn(c) : c)) }));

  return {
    camps: [],

    addCamp: ({ screenings, ...input }) => {
      const id = newId("camp");
      const camp: Camp = { ...input, id, screenings: screenings.map((s) => toScreening(id, s)) };
      set((s) => ({ camps: [...s.camps, camp] }));
      get().logAudit("camp.created", camp.name, `${screenings.length} screenings`);
      return id;
    },

    addScreening: (campId, input) => {
      const screening = toScreening(campId, input);
      replaceCamp(campId, (c) => ({ ...c, screenings: [...c.screenings, screening] }));
      return screening.id;
    },

    recordScreeningResult: (campId, screeningId, result) =>
      replaceCamp(campId, (c) => ({
        ...c,
        screenings: c.screenings.map((scr) => {
          if (scr.id !== screeningId) return scr;
          const exists = scr.results.some((r) => r.studentId === result.studentId);
          return {
            ...scr,
            results: exists
              ? scr.results.map((r) => (r.studentId === result.studentId ? result : r))
              : [...scr.results, result],
          };
        }),
      })),
  };
};
