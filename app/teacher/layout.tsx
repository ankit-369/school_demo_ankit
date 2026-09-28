import type { Metadata } from "next";
import { RoleAppShell } from "@/components/layout/role-app-shell";
import { TeacherTabBar } from "./_components/teacher-tab-bar";

export const metadata: Metadata = { title: { default: "My class", template: "%s · My class" } };

export default function TeacherLayout({ children }: LayoutProps<"/teacher">) {
  return (
    <RoleAppShell role="teacher" title="My class" tabs={<TeacherTabBar />}>
      {children}
    </RoleAppShell>
  );
}
