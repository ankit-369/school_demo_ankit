"use client";

import { Copy, ExternalLink, Link2, ShieldOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GatedButton } from "@/components/ui/gated-button";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/format";
import { useCan } from "@/lib/hooks/use-can";
import { useAppStore } from "@/lib/store/app-store";
import { checkDoctorLink } from "@/lib/store/slices/doctor-links-slice";
import type { Camp } from "@/lib/types/camp";
import type { Screening } from "@/lib/types/screening";

/** Issues the no-login link an external doctor uses to enter results for this one screening. */
export function DoctorLinkDialog({ camp, screening }: { camp: Camp; screening: Screening }) {
  const [open, setOpen] = useState(false);
  const can = useCan("manageCamps");
  const links = useAppStore((s) => s.doctorLinks);
  const camps = useAppStore((s) => s.camps);
  const create = useAppStore((s) => s.createDoctorLink);
  const revoke = useAppStore((s) => s.revokeDoctorLink);
  const live = links.find((l) => l.screeningId === screening.id && checkDoctorLink({ doctorLinks: links, camps }, l.token).ok);
  const url = live ? `${typeof window === "undefined" ? "" : window.location.origin}/doctor/camp/${live.token}` : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy — select the link and copy it manually");
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      size="md"
      title="Doctor link"
      description={`${screening.leadDoctor} can enter results for this screening without signing in. They'll see only this camp's roster for this screening.`}
      trigger={
        <GatedButton allowed={can} icon={Link2} lockedReason="Your role can't manage camps" variant="outline" className="border-line">
          Doctor link
        </GatedButton>
      }
    >
      {live ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="doctor-link" className="text-sm font-medium text-ink">Link for {live.doctorName}</label>
            <input id="doctor-link" readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="h-10 pointer-coarse:h-11 pointer-coarse:text-base w-full rounded-lg border border-line bg-surface px-3 font-mono text-[13px] text-ink" />
            <p className="text-[13px] text-ink-faint">Valid until {formatDate(live.expiresAt.slice(0, 10))}. Anyone with this link can enter results, so share it only with the doctor.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={copy}><Copy aria-hidden />Copy link</Button>
            <Button asChild variant="outline" className="border-line">
              <a href={`/doctor/camp/${live.token}`} target="_blank" rel="noreferrer"><ExternalLink aria-hidden />Open</a>
            </Button>
            <Button variant="ghost" className="text-danger-ink" onClick={() => { revoke(live.token); toast.success("Link turned off"); }}>
              <ShieldOff aria-hidden />Turn off
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-[15px] text-ink-soft">No active link for this screening yet.</p>
          <Button onClick={() => { create(camp.id, screening.id); toast.success("Doctor link created"); }}>
            <Link2 aria-hidden />Create link
          </Button>
        </div>
      )}
    </Modal>
  );
}
