import { PageHeader } from "@/components/ui/page-header";
import { TabNav } from "@/components/ui/tab-nav";

const TABS = [
  { href: "/admin/settings", label: "General" },
  { href: "/admin/settings/integrations", label: "Integrations" },
];

export default function SettingsLayout({ children }: LayoutProps<"/admin/settings">) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="School profile, academic year, message templates and connected services." />
      <TabNav label="Settings sections" items={TABS} />
      {children}
    </div>
  );
}
