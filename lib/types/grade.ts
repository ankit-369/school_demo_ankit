/** Ordered lowest → highest; promotion moves a student one step along this list. */
export const GRADES = ["JKG", "SKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;

export type Grade = (typeof GRADES)[number];

export const DIVISIONS = ["A", "B", "C"] as const;

export type Division = (typeof DIVISIONS)[number];

/** "8" + "B" → "8-B"; used for staff class assignments. */
export type ClassKey = `${Grade}-${Division}`;

export function classKey(grade: Grade, division: Division): ClassKey {
  return `${grade}-${division}`;
}

export function gradeLabel(grade: Grade): string {
  return grade === "JKG" || grade === "SKG" ? grade : `Grade ${grade}`;
}
