import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeading({ title, actions, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="text-lg leading-7 font-semibold text-ink">{title}</h2>
      {actions}
    </div>
  );
}
