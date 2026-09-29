"use client";

import { z } from "zod";
import { EditableSection, type EditableField } from "@/components/students/editable-section";
import { can } from "@/lib/permissions";
import { HOUSES, studentFields, TRANSPORTS } from "@/lib/schemas/student";
import { useAppStore } from "@/lib/store/app-store";
import type { House, Student, Transport } from "@/lib/types/student";

type ParticularsValues = {
  motherName: string;
  fatherName: string;
  admissionNo: string;
  house: House;
  transport: Transport;
};

const particularsSchema = z.object({
  motherName: studentFields.motherName,
  fatherName: studentFields.fatherName,
  admissionNo: studentFields.admissionNo,
  house: studentFields.house,
  transport: studentFields.transport,
});

const TRANSPORT_LABELS: Record<Transport, string> = { "school-bus": "School bus", private: "Private", walker: "Walks to school" };

export function ParticularsCard({ student: s }: { student: Student }) {
  const role = useAppStore((st) => st.role);
  const updateStudent = useAppStore((st) => st.updateStudent);
  const canEdit = can(role, "editDemographics");

  const fields: EditableField<ParticularsValues>[] = [
    { name: "motherName", label: "Mother's name", type: "text" },
    { name: "fatherName", label: "Father's name", type: "text" },
    { name: "admissionNo", label: "Admission no.", type: "text" },
    { name: "house", label: "House", type: "select", options: HOUSES.map((h) => ({ value: h, label: h })) },
    { name: "transport", label: "Transport", type: "select", options: TRANSPORTS.map((t) => ({ value: t, label: TRANSPORT_LABELS[t] })), format: (v) => TRANSPORT_LABELS[v as unknown as Transport] },
  ];

  const values: ParticularsValues = {
    motherName: s.motherName ?? "",
    fatherName: s.fatherName ?? "",
    admissionNo: s.admissionNo,
    house: s.house,
    transport: s.transport,
  };

  return (
    <EditableSection
      title="Student particulars"
      canEdit={canEdit}
      lockedReason={canEdit ? undefined : "Your role can't edit student particulars"}
      values={values}
      fields={fields}
      schema={particularsSchema}
      columns={2}
      onSave={(next, summary) => updateStudent(s.id, next, summary)}
    />
  );
}
