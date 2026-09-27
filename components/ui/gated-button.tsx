import { Lock, type LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type GatedButtonProps = ComponentProps<typeof Button> & {
  allowed: boolean;
  /** Shown as a tooltip when the current role lacks the permission. */
  lockedReason: string;
  icon: LucideIcon;
};

/** A button that swaps its icon for a lock and disables itself when not permitted. */
export function GatedButton({ allowed, lockedReason, icon: Icon, children, disabled, title, ...props }: GatedButtonProps) {
  const Shown = allowed ? Icon : Lock;
  return (
    <Button {...props} disabled={!allowed || disabled} title={allowed ? title : lockedReason}>
      <Shown aria-hidden />
      {children}
    </Button>
  );
}
