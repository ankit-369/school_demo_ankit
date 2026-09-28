import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { SECONDARY_NAV } from "@/components/layout/nav-items";

/**
 * On desktop these pages live in the sidebar's "Oversight" section; this
 * gives phones (which only see the 5-icon bottom bar) a way in.
 */
export function OversightLinksCard() {
  return (
    <div className="md:hidden">
      <Panel title="Oversight" description="Notifications, consent, reports and the audit log." bodyClassName="p-0 gap-0">
        <ul className="divide-y divide-line">
          {SECONDARY_NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="flex items-center gap-3 px-5 py-3 transition-colors duration-150 hover:bg-surface">
                <item.icon aria-hidden className="size-[18px] shrink-0 text-ink-faint" />
                <span className="flex-1 text-[15px] font-medium text-ink">{item.label}</span>
                <ChevronRight aria-hidden className="size-4 text-ink-faint" />
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
