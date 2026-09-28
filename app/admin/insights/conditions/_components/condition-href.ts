import type { ConditionKind } from "@/lib/selectors/insights-conditions";
import type { Grade } from "@/lib/types/grade";

/** Builds /admin/insights/conditions URLs; the URL is the single source of filter state. */
export function conditionHref({ grade, condition, kind }: { grade: Grade | null; condition?: string; kind?: ConditionKind }) {
  const q = new URLSearchParams();
  if (condition && kind) {
    q.set("condition", condition);
    q.set("kind", kind);
  }
  if (grade) q.set("grade", grade);
  const s = q.toString();
  return `/admin/insights/conditions${s ? `?${s}` : ""}`;
}
