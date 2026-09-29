"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type ConfirmDialogProps = {
  trigger: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

/** Small centered confirm, e.g. for a delete — never a full-screen sheet on mobile. */
export function ConfirmDialog({ trigger, title, description, children, confirmLabel = "Delete", destructive = true, onConfirm }: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      size="sm"
      mobile="dialog"
      title={title}
      description={description}
      trigger={trigger}
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
