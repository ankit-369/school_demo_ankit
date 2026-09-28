"use client";

import Link from "next/link";
import { ArrowUpCircle, Lock, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCan } from "@/lib/hooks/use-can";
import { AddStudentDialog } from "./add-student/add-student-dialog";

/** Directory header actions: bulk import and year-end promotion sit beside Add student. */
export function DirectoryActions() {
  const can = useCan("manageStudents");
  const locked = { disabled: true, title: "Your role can't manage students" };

  return (
    <>
      {can ? (
        <>
          <Button asChild variant="outline" className="border-line">
            <Link href="/admin/students/import">
              <Upload aria-hidden />
              Import CSV
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-line">
            <Link href="/admin/academic-year/promote">
              <ArrowUpCircle aria-hidden />
              Promote year
            </Link>
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" className="border-line" {...locked}>
            <Lock aria-hidden />
            Import CSV
          </Button>
          <Button variant="outline" className="border-line" {...locked}>
            <Lock aria-hidden />
            Promote year
          </Button>
        </>
      )}
      <AddStudentDialog />
    </>
  );
}
