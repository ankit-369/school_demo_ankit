import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { KpiOverview } from "./_components/kpi-overview";
import { PrimitivesPreview } from "./_components/primitives-preview";
import { RecentCampsTable } from "./_components/recent-camps-table";
import { ScheduleCampButton } from "./_components/schedule-camp-button";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <PageHeader
        title="Hello, Mr. Ankit"
        description="Here's today's health overview for Shanti Asiatic School."
        actions={<ScheduleCampButton />}
      />
      <KpiOverview />
      <section className="flex flex-col gap-4">
        <SectionHeading
          title="Recent health camps"
          actions={
            <Link
              href="/admin/camps"
              className="rounded-sm text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          }
        />
        <RecentCampsTable />
      </section>
      <PrimitivesPreview />
    </div>
  );
}
