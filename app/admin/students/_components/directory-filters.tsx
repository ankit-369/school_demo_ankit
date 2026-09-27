"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { DIVISIONS, GRADES, gradeLabel } from "@/lib/types/grade";

export type DirectoryFilterState = {
  query: string;
  grade: string;
  division: string;
  status: string;
  condition: string;
};

export const EMPTY_FILTERS: DirectoryFilterState = { query: "", grade: "", division: "", status: "active", condition: "" };

type DirectoryFiltersProps = {
  value: DirectoryFilterState;
  onChange: (next: DirectoryFilterState) => void;
  healthTags: string[];
};

export function DirectoryFilters({ value, onChange, healthTags }: DirectoryFiltersProps) {
  const set = (key: keyof DirectoryFilterState) => (e: { target: { value: string } }) =>
    onChange({ ...value, [key]: e.target.value });
  const dirty = JSON.stringify(value) !== JSON.stringify(EMPTY_FILTERS);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative lg:w-72">
        <label htmlFor="dir-search" className="sr-only">Search students</label>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
        <input
          id="dir-search"
          type="search"
          value={value.query}
          onChange={set("query")}
          placeholder="Name, HFID or admission no."
          className="h-10 w-full rounded-lg border border-input bg-canvas pr-3 pl-9 text-sm text-ink outline-none placeholder:text-ink-faint focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:flex-1">
        <NativeSelect aria-label="Class" value={value.grade} onChange={set("grade")} placeholder="All classes" options={GRADES.map((g) => ({ value: g, label: gradeLabel(g) }))} className="lg:w-36" />
        <NativeSelect aria-label="Division" value={value.division} onChange={set("division")} placeholder="All divisions" options={DIVISIONS.map((d) => ({ value: d, label: `Division ${d}` }))} className="lg:w-36" />
        <NativeSelect
          aria-label="Status"
          value={value.status}
          onChange={set("status")}
          placeholder="All statuses"
          options={[
            { value: "active", label: "Active" },
            { value: "graduated", label: "Graduated" },
            { value: "transferred", label: "Transferred" },
          ]}
          className="lg:w-36"
        />
        <NativeSelect
          aria-label="Health condition"
          value={value.condition}
          onChange={set("condition")}
          placeholder="Any health flag"
          options={[{ value: "__any", label: "Has any flag" }, ...healthTags.map((t) => ({ value: t, label: t }))]}
          className="lg:w-44"
        />
      </div>
      {dirty && (
        <Button variant="ghost" onClick={() => onChange(EMPTY_FILTERS)} className="self-start text-ink-soft lg:self-auto">
          Clear filters
        </Button>
      )}
    </div>
  );
}
