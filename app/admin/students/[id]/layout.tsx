import { StudentProfileShell } from "./_components/student-profile-shell";

/** Shared header + tab bar for every student profile tab. */
export default async function StudentProfileLayout({ children, params }: LayoutProps<"/admin/students/[id]">) {
  const { id } = await params;
  return <StudentProfileShell id={id}>{children}</StudentProfileShell>;
}
