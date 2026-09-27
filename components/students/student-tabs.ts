/** Profile tabs; `segment` is the route below /admin/students/[id] ("" = Overview). */
export const STUDENT_TABS = [
  { segment: "", label: "Overview" },
  { segment: "medical-history", label: "Medical history" },
  { segment: "camp-history", label: "Camp history" },
  { segment: "reports", label: "Reports" },
  { segment: "notes", label: "Notes" },
] as const;

export function studentTabHref(id: string, segment: string) {
  return segment ? `/admin/students/${id}/${segment}` : `/admin/students/${id}`;
}
