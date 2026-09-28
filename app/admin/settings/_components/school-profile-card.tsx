"use client";

import { Lock, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { useCan } from "@/lib/hooks/use-can";
import { useAppStore } from "@/lib/store/app-store";
import type { SchoolProfile } from "@/lib/types/settings";

/** Keyed on the stored value so an external change (e.g. Reset demo data) remounts with fresh defaults. */
function SchoolProfileForm({ initial, canManage }: { initial: SchoolProfile; canManage: boolean }) {
  const update = useAppStore((s) => s.updateSchoolProfile);
  const [draft, setDraft] = useState(initial);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  return (
    <Panel
      title="School profile"
      description={canManage ? "Shown in the top bar and on guardian messages." : "View only — your role can't manage settings."}
      actions={
        dirty && (
          <Button
            size="sm"
            className="h-9"
            onClick={() => {
              update(draft);
              toast.success("School profile updated");
            }}
          >
            <Save aria-hidden />
            Save
          </Button>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="School name" htmlFor="school-name" className="sm:col-span-2">
          <Input id="school-name" value={draft.name} disabled={!canManage} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
        </FormField>
        <FormField label="Address" htmlFor="school-address" className="sm:col-span-2">
          <Input id="school-address" value={draft.address} disabled={!canManage} onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))} />
        </FormField>
        <FormField label="Phone" htmlFor="school-phone">
          <Input id="school-phone" value={draft.phone} disabled={!canManage} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
        </FormField>
        <FormField label="Email" htmlFor="school-email">
          <Input id="school-email" type="email" value={draft.email} disabled={!canManage} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
        </FormField>
      </div>
      {!canManage && (
        <p className="flex items-center gap-2 text-[13px] text-ink-faint">
          <Lock aria-hidden className="size-3.5" />
          Ask an administrator for “Manage school settings” to make changes.
        </p>
      )}
    </Panel>
  );
}

export function SchoolProfileCard() {
  const school = useAppStore((s) => s.school);
  const canManage = useCan("manageSettings");
  return <SchoolProfileForm key={JSON.stringify(school)} initial={school} canManage={canManage} />;
}
