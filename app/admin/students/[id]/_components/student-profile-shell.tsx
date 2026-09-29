"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { TabNav } from "@/components/ui/tab-nav";
import { STUDENT_TABS, studentTabHref } from "@/components/students/student-tabs";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { useAppStore } from "@/lib/store/app-store";
import { ProfileHeader } from "./profile-header";
import { StudentProvider } from "./student-context";

type StudentProfileShellProps = { id: string; children: ReactNode };

export function StudentProfileShell({ id, children }: StudentProfileShellProps) {
  const hydrated = useStoreHydrated();
  const student = useAppStore((s) => s.students.find((st) => st.id === id));

  if (!hydrated) {
    return (
      <div aria-busy="true" className="flex flex-col gap-6">
        <SkeletonBlock className="h-5 w-24" />
        <div className="flex items-center gap-4">
          <SkeletonBlock className="size-20 rounded-full" />
          <SkeletonBlock className="h-14 w-64" />
        </div>
        <SkeletonBlock className="h-11 w-full" />
        <SkeletonBlock className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (!student) {
    return (
      <EmptyState
        icon={UserX}
        title="Student not found"
        description="This record may have been removed, or the demo data was reset."
        action={
          <Button asChild variant="outline">
            <Link href="/admin/students">Back to students</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader student={student} />
      <TabNav
        label="Student profile sections"
        items={STUDENT_TABS.map((t) => ({ href: studentTabHref(student.id, t.segment), label: t.label }))}
      />
      <StudentProvider value={student}>{children}</StudentProvider>
    </div>
  );
}
