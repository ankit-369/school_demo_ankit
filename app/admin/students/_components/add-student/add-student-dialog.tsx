"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GatedButton } from "@/components/ui/gated-button";
import { Modal } from "@/components/ui/modal";
import { useCan } from "@/lib/hooks/use-can";
import { ADD_STUDENT_DEFAULTS, addStudentSchema, combineVision, splitList, type AddStudentValues } from "@/lib/schemas/student";
import { useAppStore } from "@/lib/store/app-store";
import { readFileAsDataUrl } from "@/lib/files";
import { AcademicFields } from "./academic-fields";
import type { SurgeryDraft } from "./add-student-surgeries";
import { BasicFields } from "./basic-fields";
import { GuardianEmergencyFields } from "./guardian-emergency-fields";
import { HealthFields } from "./health-fields";

const FORM_ID = "add-student-form";

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<File>();
  const [surgeries, setSurgeries] = useState<SurgeryDraft[]>([]);
  const addStudent = useAppStore((s) => s.addStudent);
  const can = useCan("manageStudents");
  const router = useRouter();
  const form = useForm<AddStudentValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: ADD_STUDENT_DEFAULTS,
  });

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset(ADD_STUDENT_DEFAULTS);
      setPhoto(undefined);
      setSurgeries([]);
    }
  }

  const onSubmit = form.handleSubmit(async (v) => {
    const photoUrl = photo ? await readFileAsDataUrl(photo) : null;
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
      vision: combineVision(v.visionLeft, v.visionRight),
      hearing: v.hearing,
      house: v.house,
      transport: v.transport,
      photoUrl,
      guardian: { name: v.guardianName, relation: v.guardianRelation, phone: v.guardianPhone },
      emergencyContact: v.sameAsGuardian
        ? { name: v.guardianName, relation: v.guardianRelation, phone: v.guardianPhone }
        : { name: v.emergencyContactName, relation: v.emergencyContactRelation, phone: v.emergencyContactPhone },
      motherName: v.motherName.trim() || undefined,
      fatherName: v.fatherName.trim() || undefined,
      school: {
        allergies: splitList(v.allergies),
        conditions: splitList(v.conditions),
        notes: v.notes.trim(),
        surgeries: surgeries
          .filter((s) => s.name.trim() && s.hospital.trim())
          .map((s) => ({ id: s.key, name: s.name, date: s.date, hospital: s.hospital, outcome: s.outcome })),
      },
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
        <BasicFields form={form} photo={photo} onPhotoChange={setPhoto} />
        <AcademicFields form={form} />
        <HealthFields form={form} surgeries={surgeries} onSurgeriesChange={setSurgeries} />
        <GuardianEmergencyFields form={form} />
      </form>
    </Modal>
  );
}
