"use client";

import { RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { applyTemplate, DEFAULT_TEMPLATES } from "@/lib/data/templates";
import { useCan } from "@/lib/hooks/use-can";
import { useSchoolName } from "@/lib/hooks/use-school-name";
import { useAppStore } from "@/lib/store/app-store";
import type { TemplateKey } from "@/lib/types/settings";

const SAMPLE_VARS_BASE = {
  student: "Aarav",
  title: "vision screening",
  camp: "Annual Health Drive 2026",
  date: "",
  form: "Photo & media release",
};

type FieldProps = { templateKey: TemplateKey; label: string; placeholders: string[]; value: string; canManage: boolean; schoolName: string };

/** Keyed on the stored value in the parent, so an external reset remounts with the fresh default. */
function TemplateField({ templateKey, label, placeholders, value, canManage, schoolName }: FieldProps) {
  const update = useAppStore((s) => s.updateTemplate);
  const reset = useAppStore((s) => s.resetTemplate);
  const [draft, setDraft] = useState(value);
  const dirty = draft !== value;
  const id = `tpl-${templateKey}`;
  const sampleVars = { ...SAMPLE_VARS_BASE, school: schoolName };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-ink">{label}</label>
        <div className="flex items-center gap-2">
          {value !== DEFAULT_TEMPLATES[templateKey] && canManage && (
            <Button variant="ghost" size="sm" className="h-8 text-ink-soft" onClick={() => { reset(templateKey); toast.success("Restored default wording"); }}>
              <RotateCcw aria-hidden />
              Reset
            </Button>
          )}
          {dirty && canManage && (
            <Button size="sm" className="h-8" onClick={() => { update(templateKey, draft); toast.success("Template saved"); }}>
              <Save aria-hidden />
              Save
            </Button>
          )}
        </div>
      </div>
      <Textarea id={id} rows={3} value={draft} disabled={!canManage} onChange={(e) => setDraft(e.target.value)} />
      <p className="text-[13px] text-ink-faint">Placeholders: {placeholders.map((p) => `{{${p}}}`).join(", ")}</p>
      <div className="rounded-lg bg-surface px-4 py-3">
        <p className="text-[13px] font-medium text-ink-soft">Preview</p>
        <p className="mt-1 text-sm text-ink">{applyTemplate(draft, sampleVars)}</p>
      </div>
    </div>
  );
}

export function TemplateEditor({ templateKey, label, placeholders }: { templateKey: TemplateKey; label: string; placeholders: string[] }) {
  const value = useAppStore((s) => s.templates[templateKey]);
  const canManage = useCan("manageSettings");
  const schoolName = useSchoolName();
  return <TemplateField key={value} templateKey={templateKey} label={label} placeholders={placeholders} value={value} canManage={canManage} schoolName={schoolName} />;
}
