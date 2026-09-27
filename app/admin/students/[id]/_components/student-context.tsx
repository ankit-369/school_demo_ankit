"use client";

import { createContext, useContext } from "react";
import type { Student } from "@/lib/types/student";

const StudentContext = createContext<Student | null>(null);

export const StudentProvider = StudentContext.Provider;

/** The student whose profile is open. Only usable inside the profile layout. */
export function useCurrentStudent(): Student {
  const student = useContext(StudentContext);
  if (!student) throw new Error("useCurrentStudent must be used inside the student profile layout");
  return student;
}
