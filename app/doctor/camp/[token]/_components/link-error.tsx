import { Clock, LinkIcon, ShieldOff } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { DoctorLinkCheck } from "@/lib/types/doctor-link";

type Reason = Extract<DoctorLinkCheck, { ok: false }>["reason"];

const COPY: Record<Reason, { title: string; description: string; icon: typeof Clock }> = {
  "not-found": { icon: LinkIcon, title: "This link isn't valid", description: "Check you copied the whole link, or ask the school to send it again." },
  expired: { icon: Clock, title: "This link has expired", description: "Links stop working two weeks after the camp. Ask the school for a new one." },
  revoked: { icon: ShieldOff, title: "This link was turned off", description: "The school has withdrawn access. Contact them if you still need to enter results." },
  "screening-missing": { icon: LinkIcon, title: "This screening no longer exists", description: "It may have been removed from the camp. Contact the school." },
};

export function LinkError({ reason }: { reason: Reason }) {
  const c = COPY[reason];
  return <EmptyState icon={c.icon} title={c.title} description={c.description} className="rounded-xl bg-canvas py-16 ring-1 ring-line" />;
}
