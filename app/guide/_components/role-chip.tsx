import { ROLE_LABELS, type Role } from "@/lib/types/role";
import { cn } from "@/lib/utils";

/** Small role indicator, e.g. "Nurse" or "Nurse → Teacher" for a two-role flow. */
export function RoleChip({ roles, className }: { roles: Role[]; className?: string }) {
  return (
    <span className={cn("inline-flex h-6 items-center rounded-md bg-surface px-2 text-xs font-medium text-ink-soft ring-1 ring-line ring-inset", className)}>
      {roles.map((r) => ROLE_LABELS[r]).join(" → ")}
    </span>
  );
}
