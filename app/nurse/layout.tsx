import type { Metadata } from "next";
import { RoleAppShell } from "@/components/layout/role-app-shell";
import { NurseTabBar } from "./_components/nurse-tab-bar";

export const metadata: Metadata = { title: { default: "Camp-day mode", template: "%s · Camp-day mode" } };

export default function NurseLayout({ children }: LayoutProps<"/nurse">) {
  return (
    <RoleAppShell role="nurse" title="Camp-day mode" tabs={<NurseTabBar />}>
      {children}
    </RoleAppShell>
  );
}
