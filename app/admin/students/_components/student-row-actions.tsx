"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STUDENT_TABS } from "@/components/students/student-tabs";

type StudentRowActionsProps = { id: string; name: string };

export function StudentRowActions({ id, name }: StudentRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="outline" size="sm" className="h-8 border-line px-3">
        <Link href={`/admin/students/${id}`}>View profile</Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`More for ${name}`} className="text-ink-soft">
            <MoreHorizontal aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 shadow-overlay">
          {STUDENT_TABS.slice(1).map((tab) => (
            <DropdownMenuItem key={tab.segment} asChild>
              <Link href={`/admin/students/${id}/${tab.segment}`}>{tab.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
