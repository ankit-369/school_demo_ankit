import type { Metadata } from "next";
import { RoleAppShell } from "@/components/layout/role-app-shell";

export const metadata: Metadata = { title: { default: "Camp-day mode", template: "%s · Camp-day mode" } };

export default function NurseLayout({ children }: LayoutProps<"/nurse">) {
  return (
    <RoleAppShell role="nurse" title="Camp-day mode">
      {children}
    </RoleAppShell>
  );
}
