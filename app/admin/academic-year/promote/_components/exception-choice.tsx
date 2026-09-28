import type { ExceptionOutcome } from "@/lib/academic/promotion-plan";
import { cn } from "@/lib/utils";

export type Choice = "default" | ExceptionOutcome;

type ExceptionChoiceProps = {
  name: string;
  studentName: string;
  defaultLabel: string;
  value: Choice;
  onChange: (c: Choice) => void;
};

/** A compact radio group: the class default (promote/graduate) or an exception. */
export function ExceptionChoice({ name, studentName, defaultLabel, value, onChange }: ExceptionChoiceProps) {
  const choices: { value: Choice; label: string }[] = [
    { value: "default", label: defaultLabel },
    { value: "retain", label: "Retain" },
    { value: "transfer", label: "Transfer" },
    { value: "exit", label: "Exit" },
  ];
  return (
    <div role="radiogroup" aria-label={`Outcome for ${studentName}`} className="inline-flex w-full rounded-lg border border-line p-0.5 sm:w-auto">
      {choices.map((c) => (
        <label
          key={c.value}
          className={cn(
            "flex h-8 flex-1 cursor-pointer items-center justify-center rounded-md px-2.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary sm:flex-none pointer-coarse:h-10",
            value === c.value
              ? c.value === "default"
                ? "bg-primary text-white"
                : "bg-warning/15 text-warning-ink"
              : "text-ink-soft hover:text-ink",
          )}
        >
          <input type="radio" name={name} value={c.value} checked={value === c.value} onChange={() => onChange(c.value)} className="sr-only" />
          {c.label}
        </label>
      ))}
    </div>
  );
}
