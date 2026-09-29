"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAppStore } from "@/lib/store/app-store";
import type { Role } from "@/lib/types/role";
import { cn } from "@/lib/utils";

type GuideLinkProps = {
  role: Role;
  href: string;
  children: ReactNode;
  size?: "sm" | "lg";
  className?: string;
};

/** Sets the "Viewing as" role, then navigates — used for every "Go" and "Start as" button in the guide. */
export function GuideLink({ role, href, children, size = "sm", className }: GuideLinkProps) {
  const setRole = useAppStore((s) => s.setRole);
  const router = useRouter();

  function go() {
    setRole(role);
    router.push(href.includes("?") ? `${href}&from=guide` : `${href}?from=guide`);
  }

  return (
    <button
      type="button"
      onClick={go}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg font-semibold text-white transition-colors duration-150 hover:bg-primary/90 pointer-coarse:min-h-11",
        size === "lg" ? "bg-primary px-5 py-3 text-[15px]" : "bg-primary px-3 py-2 text-[13px]",
        className,
      )}
    >
      {children}
      <ArrowRight aria-hidden className="size-4" />
    </button>
  );
}
