"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAppStore } from "@/lib/store/app-store";
import { allHealthTags, hasHealthFlags, studentMatchesQuery } from "@/lib/selectors/students";
import { GRADES } from "@/lib/types/grade";
import type { Student } from "@/lib/types/student";
import { DirectoryActions } from "./directory-actions";
import { DirectoryFilters, EMPTY_FILTERS, type DirectoryFilterState } from "./directory-filters";
import { StudentCardList } from "./student-card-list";
import { StudentsTable } from "./students-table";

function matches(s: Student, f: DirectoryFilterState) {
  const { allergies, conditions } = s.medicalHistory.school;
  return (
    studentMatchesQuery(s, f.query) &&
    (!f.grade || s.grade === f.grade) &&
    (!f.division || s.division === f.division) &&
    (!f.status || s.status === f.status) &&
    (!f.condition ||
      (f.condition === "__any" ? hasHealthFlags(s) : [...allergies, ...conditions].includes(f.condition)))
  );
}

/** Class order, then division, then roll number. */
function byClass(a: Student, b: Student) {
  return (
    GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade) ||
    a.division.localeCompare(b.division) ||
    a.rollNumber - b.rollNumber
  );
}

type StudentDirectoryProps = {
  /** Preset filters, e.g. a class from a dashboard drill-down. */
  initialFilters?: Partial<DirectoryFilterState>;
  /** Hide the page header when embedded in another page. */
  embedded?: boolean;
};

export function StudentDirectory({ initialFilters, embedded }: StudentDirectoryProps = {}) {
  const students = useAppStore((s) => s.students);
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, ...initialFilters });
  const tags = useMemo(() => allHealthTags(students), [students]);
  const rows = useMemo(() => students.filter((s) => matches(s, filters)).sort(byClass), [students, filters]);

  return (
    <div className="flex flex-col gap-6">
      {!embedded && (
        <PageHeader
          title="Students"
          description={`${students.filter((s) => s.status === "active").length} active students across ${GRADES.length} classes`}
          actions={<DirectoryActions />}
        />
      )}
      <DirectoryFilters value={filters} onChange={setFilters} healthTags={tags} />
      <p className="text-sm text-ink-soft" aria-live="polite">
        Showing {rows.length} of {students.length} students
      </p>
      <div className="hidden md:block">
        <StudentsTable students={rows} />
      </div>
      <div className="md:hidden">
        <StudentCardList students={rows} />
      </div>
    </div>
  );
}
