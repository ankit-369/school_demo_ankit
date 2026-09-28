import { Panel } from "@/components/ui/panel";
import { TEMPLATE_INFO } from "@/lib/data/templates";
import { TemplateEditor } from "./template-editor";

export function TemplatesCard() {
  return (
    <Panel title="Notification templates" description="The wording used for automated guardian reminders. Changes apply the next time a reminder is sent.">
      {TEMPLATE_INFO.map((t) => (
        <TemplateEditor key={t.key} templateKey={t.key} label={t.label} placeholders={t.placeholders} />
      ))}
    </Panel>
  );
}
