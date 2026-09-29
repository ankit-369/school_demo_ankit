"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";
import { EditableSection, type EditableField } from "@/components/students/editable-section";
import { HfilesSyncBadge } from "@/components/ui/hfiles-sync-badge";
import { ageFromDob, capitalize } from "@/lib/format";
import { can } from "@/lib/permissions";
import { studentFields } from "@/lib/schemas/student";
import { isHfilesConnected } from "@/lib/selectors/students";
import { useAppStore } from "@/lib/store/app-store";
import { DIVISIONS, gradeLabel, GRADES } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";
import { PhotoUploadButton } from "./photo-upload-button";
import { StudentStatusControl } from "./student-status-control";

type DetailValues = {
  name: string;
  dob: string;
  gender: "male" | "female";
  grade: (typeof GRADES)[number];
  division: (typeof DIVISIONS)[number];
  rollNumber: number;
  classTeacherId: string;
};

const detailSchema = z.object({
  name: studentFields.name,
  dob: studentFields.dob,
  gender: studentFields.gender,
  grade: studentFields.grade,
  division: studentFields.division,
  rollNumber: studentFields.rollNumber,
  classTeacherId: studentFields.classTeacherId,
});

/** The hero block plus an EditableSection standing in for the old read-only facts grid. */
export function ProfileHeader({ student: s }: { student: Student }) {
  const role = useAppStore((st) => st.role);
  const updateStudent = useAppStore((st) => st.updateStudent);
  // Filtering inside the selector would return a new array every render and
  // loop forever — select the stable `staff` array and filter in the body.
  const staff = useAppStore((st) => st.staff);
  const teachers = staff.filter((member) => member.role === "teacher");
  const canEdit = can(role, "editDemographics");

  const fields: EditableField<DetailValues>[] = [
    { name: "name", label: "Full name", type: "text", span: 2 },
    { name: "dob", label: "Date of birth", type: "date", format: (v) => `${ageFromDob(v as unknown as string)} yrs` },
    { name: "gender", label: "Gender", type: "select", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }], format: (v) => capitalize(v as unknown as string) },
    { name: "grade", label: "Class", type: "select", options: GRADES.map((g) => ({ value: g, label: gradeLabel(g) })), format: (v) => gradeLabel(v as unknown as (typeof GRADES)[number]) },
    { name: "division", label: "Division", type: "select", options: DIVISIONS.map((d) => ({ value: d, label: d })) },
    { name: "rollNumber", label: "Roll no.", type: "number" },
    { name: "classTeacherId", label: "Class teacher", type: "select", options: teachers.map((t) => ({ value: t.id, label: t.name })), format: (v) => teachers.find((t) => t.id === v)?.name ?? "Not assigned" },
  ];

  const values: DetailValues = {
    name: s.name,
    dob: s.dob,
    gender: s.gender,
    grade: s.grade,
    division: s.division,
    rollNumber: s.rollNumber,
    classTeacherId: s.classTeacherId,
  };

  return (
    <header className="flex flex-col gap-5">
      <Link href="/admin/students" className="inline-flex w-fit items-center gap-1 rounded-sm text-sm font-medium text-ink-soft hover:text-ink pointer-coarse:min-h-11">
        <ChevronLeft aria-hidden className="size-4" />
        Students
      </Link>
      <div className="flex items-center gap-4">
        <PhotoUploadButton studentId={s.id} name={s.name} photoUrl={s.photoUrl} canEdit={canEdit} />
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="text-2xl leading-8 font-semibold tracking-tight text-ink">{s.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-6 items-center rounded-md bg-surface px-2 text-xs font-medium text-ink-soft ring-1 ring-line ring-inset">
              HFID {s.hfid}
            </span>
            <HfilesSyncBadge synced={isHfilesConnected(s)} syncedLabel="hfiles.in connected" unsyncedLabel="hfiles.in not connected" />
            <StudentStatusControl student={s} canEdit={canEdit} />
          </div>
        </div>
      </div>
      <EditableSection
        title="Student details"
        canEdit={canEdit}
        lockedReason={canEdit ? undefined : "Your role can't edit student details"}
        values={values}
        fields={fields}
        schema={detailSchema}
        columns={2}
        onSave={(next, summary) => updateStudent(s.id, next, summary)}
      />
    </header>
  );
}
