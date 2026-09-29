"use client";

import { z } from "zod";
import { EditableSection, type EditableField } from "@/components/students/editable-section";
import { HEARING_LABELS } from "@/lib/labels";
import { can } from "@/lib/permissions";
import { combineVision, splitVision, studentFields } from "@/lib/schemas/student";
import { useAppStore } from "@/lib/store/app-store";
import type { BloodGroup, HearingStatus, Student } from "@/lib/types/student";

type VitalsValues = {
  heightCm: number;
  weightKg: number;
  bloodGroup: BloodGroup;
  visionLeft: string;
  visionRight: string;
  hearing: HearingStatus;
};

const vitalsSchema = z.object({
  heightCm: studentFields.heightCm,
  weightKg: studentFields.weightKg,
  bloodGroup: studentFields.bloodGroup,
  visionLeft: studentFields.visionLeft,
  visionRight: studentFields.visionRight,
  hearing: studentFields.hearing,
});

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function VitalsBand({ student: s }: { student: Student }) {
  const role = useAppStore((st) => st.role);
  const updateStudent = useAppStore((st) => st.updateStudent);
  const canEdit = can(role, "editMedical");
  const { left, right } = splitVision(s.vision);

  const fields: EditableField<VitalsValues>[] = [
    { name: "heightCm", label: "Height", type: "number", suffix: "cm", step: "0.1" },
    { name: "weightKg", label: "Weight", type: "number", suffix: "kg", step: "0.1" },
    { name: "bloodGroup", label: "Blood group", type: "select", options: BLOOD_GROUPS.map((b) => ({ value: b, label: b })) },
    { name: "visionLeft", label: "Vision (left eye)", type: "text" },
    { name: "visionRight", label: "Vision (right eye)", type: "text" },
    { name: "hearing", label: "Hearing", type: "select", options: Object.entries(HEARING_LABELS).map(([value, label]) => ({ value, label })), format: (v) => HEARING_LABELS[v as unknown as HearingStatus] },
  ];

  const values: VitalsValues = { heightCm: s.heightCm, weightKg: s.weightKg, bloodGroup: s.bloodGroup, visionLeft: left, visionRight: right, hearing: s.hearing };

  return (
    <EditableSection
      title="Vitals"
      description={`BMI ${s.bmi.toFixed(1)} kg/m² — recalculates automatically from height and weight.`}
      canEdit={canEdit}
      lockedReason={canEdit ? undefined : "Your role can't edit medical vitals"}
      values={values}
      fields={fields}
      schema={vitalsSchema}
      columns={2}
      onSave={({ visionLeft, visionRight, ...rest }, summary) => updateStudent(s.id, { ...rest, vision: combineVision(visionLeft, visionRight) }, summary)}
    />
  );
}
