"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ModalProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  /** Action buttons; rendered in a hairline-separated footer. */
  footer?: ReactNode;
  /** Optional trigger element — omit when controlling with open/onOpenChange. */
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "sm" | "md" | "lg";
};

const SIZES = { sm: "sm:max-w-sm", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

export function Modal({
  title,
  description,
  children,
  footer,
  trigger,
  open,
  onOpenChange,
  size = "md",
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn("gap-5 p-6", SIZES[size])}>
        <DialogHeader className="gap-1 pr-8">
          <DialogTitle className="text-lg font-semibold text-ink">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-ink-soft">{description}</DialogDescription>
          )}
        </DialogHeader>
        {children && <div className="text-[15px] text-ink">{children}</div>}
        {footer && <DialogFooter className="-mx-6 -mb-6 bg-canvas px-6 py-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
