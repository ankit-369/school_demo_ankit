"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GatedButton } from "@/components/ui/gated-button";
import { useCan } from "@/lib/hooks/use-can";
import { Modal } from "@/components/ui/modal";
import { useAppStore } from "@/lib/store/app-store";
import { ADD_STUDENT_DEFAULTS, addStudentSchema, splitList, type AddStudentValues } from "./add-student-schema";
import { HealthGuardianFields } from "./health-guardian-fields";
import { StudentDetailsFields } from "./student-details-fields";

const FORM_ID = "add-student-form";

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const addStudent = useAppStore((s) => s.addStudent);
  const can = useCan("manageStudents");
  const router = useRouter();
  const form = useForm<AddStudentValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: ADD_STUDENT_DEFAULTS,
  });

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) form.reset(ADD_STUDENT_DEFAULTS);
  }

  const onSubmit = form.handleSubmit((v) => {
    const id = addStudent({
      name: v.name,
      gender: v.gender,
      dob: v.dob,
      grade: v.grade,
      division: v.division,
      rollNumber: v.rollNumber,
      bloodGroup: v.bloodGroup,
      heightCm: v.heightCm,
      weightKg: v.weightKg,
      vision: v.vision,
      hearing: v.hearing,
      house: v.house,
      transport: v.transport,
      guardian: { name: v.guardianName, relation: v.guardianRelation, phone: v.guardianPhone },
      school: { allergies: splitList(v.allergies), conditions: splitList(v.conditions), notes: v.notes.trim() },
    });
    onOpenChange(false);
    toast.success(`${v.name} added to the directory`, {
      action: { label: "View profile", onClick: () => router.push(`/admin/students/${id}`) },
    });
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Add student"
      description="Creates a school health record. Families can connect hfiles.in later."
      trigger={
        <GatedButton allowed={can} icon={UserPlus} lockedReason="Your role can't add students">
          Add student
        </GatedButton>
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={form.formState.isSubmitting}>
            Add student
          </Button>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={onSubmit} className="flex flex-col gap-8">
        <StudentDetailsFields form={form} />
        <HealthGuardianFields form={form} />
      </form>
    </Modal>
  );
}
