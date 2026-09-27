import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { SourceBadge } from "@/components/ui/source-badge";
import { StatusBadge } from "@/components/ui/status-badge";

/** Temporary Phase 0 showcase of badges and the empty state. */
export function PrimitivesPreview() {
  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <SectionHeading title="Status and source" />
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="success" label="Completed" />
          <StatusBadge tone="warning" label="Follow-up required" />
          <StatusBadge tone="danger" label="Anaphylaxis risk" />
          <StatusBadge tone="neutral" label="Not screened" />
        </div>
        <div className="flex flex-wrap gap-2">
          <SourceBadge source="school" />
          <SourceBadge source="hfiles" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <SectionHeading title="Open follow-ups" />
        <div className="rounded-xl border border-dashed border-line">
          <EmptyState
            icon={Inbox}
            title="No follow-ups yet"
            description="Students flagged during a screening will appear here."
          />
        </div>
      </div>
    </section>
  );
}
