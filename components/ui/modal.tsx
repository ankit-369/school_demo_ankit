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
  /** Action buttons; rendered in a hairline-separated footer that stays visible while the body scrolls. */
  footer?: ReactNode;
  /** Optional trigger element — omit when controlling with open/onOpenChange. */
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "sm" | "md" | "lg";
  /** Phones: forms open as a full-screen sheet; short confirmations stay a centered dialog. */
  mobile?: "sheet" | "dialog";
};

const SIZES = { sm: "sm:max-w-sm", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

const SHEET =
  "max-sm:inset-0 max-sm:h-dvh max-sm:max-h-none max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:ring-0 max-sm:data-open:zoom-in-100 max-sm:data-open:slide-in-from-bottom-6 max-sm:data-closed:zoom-out-100 max-sm:data-closed:slide-out-to-bottom-6";

export function Modal({
  title,
  description,
  children,
  footer,
  trigger,
  open,
  onOpenChange,
  size = "md",
  mobile = "sheet",
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn("flex max-h-[min(90dvh,820px)] flex-col gap-0 p-0", SIZES[size], mobile === "sheet" && SHEET)}>
        <DialogHeader className="gap-1 px-6 pt-6 pr-14 pb-4">
          <DialogTitle className="text-lg font-semibold text-ink">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-ink-soft">{description}</DialogDescription>
          )}
        </DialogHeader>
        {children && (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 text-[15px] text-ink">{children}</div>
        )}
        {footer && <DialogFooter className="mx-0 mb-0 bg-canvas px-6 py-4 max-sm:pb-[calc(env(safe-area-inset-bottom)+1rem)]">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
