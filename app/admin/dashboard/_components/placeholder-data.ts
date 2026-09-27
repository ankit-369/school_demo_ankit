/**
 * Static placeholder figures to prove the layout. Replaced by the Zustand
 * store in Phase 1.
 */
export type CampRow = {
  id: string;
  date: string;
  standard: string;
  leadDoctor: string;
  screened: number;
  total: number;
  status: "complete" | "in-progress" | "overdue";
};

export const PLACEHOLDER_CAMPS: CampRow[] = [
  { id: "c1", date: "02 Sep 2024", standard: "10th – 12th", leadDoctor: "Dr. Shreya Varma", screened: 420, total: 450, status: "in-progress" },
  { id: "c2", date: "28 Aug 2024", standard: "6th – 9th", leadDoctor: "Dr. Amit Shah", screened: 600, total: 600, status: "complete" },
  { id: "c3", date: "24 Aug 2024", standard: "Pre-primary", leadDoctor: "Dr. Rahul Mehta", screened: 94, total: 210, status: "overdue" },
];
