"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

/** Proves the Modal primitive; the real scheduling form arrives in a later phase. */
export function ScheduleCampButton() {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Schedule a health camp"
      description="The full scheduling form arrives in a later phase."
      trigger={
        <Button>
          <Plus aria-hidden />
          Schedule camp
        </Button>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast.success("Modal and toast primitives are wired up");
            }}
          >
            Continue
          </Button>
        </>
      }
    >
      <p className="text-ink-soft">
        This dialog uses the shared <code className="text-ink">Modal</code> primitive with a 200ms
        ease-out entrance.
      </p>
    </Modal>
  );
}
