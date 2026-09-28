import { Ambulance, Phone, Stethoscope } from "lucide-react";
import { EMERGENCY_NUMBER } from "@/lib/data/action-plans";
import type { Staff } from "@/lib/types/staff";
import type { Student } from "@/lib/types/student";

const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

/** Tap-to-call, biggest first. Numbers are shown as text too, in case the device can't dial. */
export function CallButtons({ student, nurse, showAmbulance }: { student: Student; nurse?: Staff; showAmbulance: boolean }) {
  return (
    <section aria-label="Emergency contacts" className="flex flex-col gap-2">
      {showAmbulance && (
        <a href={tel(EMERGENCY_NUMBER)} className="flex h-14 items-center justify-center gap-2 rounded-xl bg-danger text-[17px] font-semibold text-white transition-colors duration-150 hover:bg-danger/90">
          <Ambulance aria-hidden className="size-5" />
          Ambulance · {EMERGENCY_NUMBER}
        </a>
      )}
      <a href={tel(student.guardian.phone)} className="flex min-h-14 items-center gap-3 rounded-xl bg-primary px-4 text-white transition-colors duration-150 hover:bg-primary/90">
        <Phone aria-hidden className="size-5 shrink-0" />
        <span className="flex flex-col">
          <span className="text-[16px] font-semibold">Call {student.guardian.name}</span>
          <span className="text-[13px] text-white/80">{student.guardian.relation} · {student.guardian.phone}</span>
        </span>
      </a>
      {nurse && (
        <a href={tel(nurse.phone)} className="flex min-h-14 items-center gap-3 rounded-xl border border-line bg-canvas px-4 text-ink transition-colors duration-150 hover:bg-surface">
          <Stethoscope aria-hidden className="size-5 shrink-0 text-ink-soft" />
          <span className="flex flex-col">
            <span className="text-[16px] font-semibold">Call {nurse.name}</span>
            <span className="text-[13px] text-ink-faint">School nurse · {nurse.phone}</span>
          </span>
        </a>
      )}
    </section>
  );
}
