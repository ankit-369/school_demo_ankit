"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Panel, PanelSection } from "@/components/ui/panel";
import { SourceBadge } from "@/components/ui/source-badge";
import { HealthFlags } from "@/components/students/health-flags";
import { summarizeChanges, summarizeListChange } from "@/lib/audit-diff";
import { can } from "@/lib/permissions";
import { GUARDIAN_RELATIONS, splitList, studentFields } from "@/lib/schemas/student";
import { useAppStore } from "@/lib/store/app-store";
import type { Student } from "@/lib/types/student";

const allergiesSchema = z.object({ allergies: studentFields.allergies });
type AllergiesValues = z.infer<typeof allergiesSchema>;

const guardianSchema = z.object({
  guardianName: studentFields.guardianName,
  guardianRelation: studentFields.guardianRelation,
  guardianPhone: studentFields.guardianPhone,
});
type GuardianValues = z.infer<typeof guardianSchema>;

/** What a teacher or nurse needs in the first minute of an emergency — the one place both allergies and the guardian's contact are edited together. */
export function EmergencyCard({ student: s }: { student: Student }) {
  const role = useAppStore((st) => st.role);
  const updateStudent = useAppStore((st) => st.updateStudent);
  const updateSchool = useAppStore((st) => st.updateSchoolMedicalHistory);
  const canEdit = can(role, "editMedical");
  const { school, hfiles } = s.medicalHistory;
  const hfilesOnly = hfiles.allergies.filter((a) => !school.allergies.includes(a));

  const [editingAllergies, setEditingAllergies] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState(false);

  const allergiesForm = useForm<AllergiesValues>({ resolver: zodResolver(allergiesSchema), defaultValues: { allergies: school.allergies.join(", ") } });
  const guardianForm = useForm<GuardianValues>({
    resolver: zodResolver(guardianSchema),
    defaultValues: { guardianName: s.guardian.name, guardianRelation: s.guardian.relation, guardianPhone: s.guardian.phone },
  });
  const ge = guardianForm.formState.errors;

  const startAllergies = () => { allergiesForm.reset({ allergies: school.allergies.join(", ") }); setEditingAllergies(true); };
  const startGuardian = () => { guardianForm.reset({ guardianName: s.guardian.name, guardianRelation: s.guardian.relation, guardianPhone: s.guardian.phone }); setEditingGuardian(true); };

  const saveAllergies = allergiesForm.handleSubmit((v) => {
    const next = splitList(v.allergies);
    const summary = summarizeListChange("Allergies", school.allergies, next);
    if (summary) {
      updateSchool(s.id, { allergies: next }, summary);
      toast.success("Allergies updated");
    }
    setEditingAllergies(false);
  });

  const saveGuardian = guardianForm.handleSubmit((v) => {
    const before = { guardianName: s.guardian.name, guardianRelation: s.guardian.relation, guardianPhone: s.guardian.phone };
    const summary = summarizeChanges(
      [{ name: "guardianName", label: "Guardian name" }, { name: "guardianRelation", label: "Guardian relation" }, { name: "guardianPhone", label: "Guardian phone" }],
      before,
      v,
    );
    if (summary) {
      updateStudent(s.id, { guardian: { name: v.guardianName, relation: v.guardianRelation, phone: v.guardianPhone } }, summary);
      toast.success("Guardian details updated");
    }
    setEditingGuardian(false);
  });

  return (
    <Panel title="Emergency information">
      <PanelSection title="Allergies">
        {editingAllergies ? (
          <form noValidate onSubmit={saveAllergies} className="flex flex-col gap-2">
            <Input {...allergiesForm.register("allergies")} placeholder="e.g. Peanuts, Penicillin" />
            <div className="flex gap-2">
              <Button size="sm" type="submit" className="h-8">Save</Button>
              <Button size="sm" variant="ghost" type="button" onClick={() => setEditingAllergies(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <HealthFlags allergies={school.allergies} conditions={[]} max={10} />
            {canEdit && (
              <Button variant="ghost" size="sm" className="h-7 text-primary" onClick={startAllergies}>
                <Pencil aria-hidden />
                Edit
              </Button>
            )}
          </div>
        )}
        {hfilesOnly.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-soft">
            <SourceBadge source="hfiles" />
            <span>also reports {hfilesOnly.join(", ")}</span>
          </div>
        )}
      </PanelSection>
      <PanelSection title="Conditions">
        <HealthFlags allergies={[]} conditions={school.conditions} max={10} />
      </PanelSection>
      {school.notes && (
        <PanelSection title="Nurse notes">
          <p className="text-[15px] text-ink">{school.notes}</p>
        </PanelSection>
      )}
      <PanelSection title="Guardian">
        {editingGuardian ? (
          <form noValidate onSubmit={saveGuardian} className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Name" htmlFor="em-guardian-name" error={ge.guardianName?.message}>
                <Input {...fieldA11y("em-guardian-name", ge.guardianName?.message)} {...guardianForm.register("guardianName")} />
              </FormField>
              <FormField label="Relation" htmlFor="em-guardian-relation">
                <NativeSelect id="em-guardian-relation" options={GUARDIAN_RELATIONS.map((r) => ({ value: r, label: r }))} {...guardianForm.register("guardianRelation")} />
              </FormField>
              <FormField label="Phone" htmlFor="em-guardian-phone" error={ge.guardianPhone?.message} className="sm:col-span-2">
                <Input {...fieldA11y("em-guardian-phone", ge.guardianPhone?.message)} type="tel" {...guardianForm.register("guardianPhone")} />
              </FormField>
            </div>
            <div className="flex gap-2">
              <Button size="sm" type="submit" className="h-8">Save</Button>
              <Button size="sm" variant="ghost" type="button" onClick={() => setEditingGuardian(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[15px] text-ink">
              {s.guardian.name} <span className="text-ink-faint">· {s.guardian.relation}</span>
            </p>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${s.guardian.phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-10 pointer-coarse:min-h-11 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface"
              >
                <Phone aria-hidden className="size-4 text-ink-faint" />
                {s.guardian.phone}
              </a>
              {canEdit && (
                <Button variant="ghost" size="sm" className="h-9 text-primary" onClick={startGuardian}>
                  <Pencil aria-hidden />
                  Edit
                </Button>
              )}
            </div>
          </div>
        )}
      </PanelSection>
    </Panel>
  );
}
