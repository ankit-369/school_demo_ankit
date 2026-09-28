"use client";

import { FileText, UploadCloud } from "lucide-react";
import { useState } from "react";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";

type FilePickerProps = {
  id: string;
  file?: File;
  error?: string;
  onChange: (file: File | undefined) => void;
  /** Native accept filter, e.g. ".csv". */
  accept?: string;
  /** What to pick, e.g. "a CSV file". */
  noun?: string;
};

/** A large tap target wrapping a native file input; also accepts drag-and-drop. */
export function FilePicker({ id, file, error, onChange, accept = ".pdf,image/*", noun = "a file" }: FilePickerProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onChange(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "flex min-h-24 cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-4 transition-colors duration-150 hover:bg-surface has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30",
        error ? "border-danger" : dragging ? "border-primary bg-surface" : "border-line",
      )}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.files?.[0])}
      />
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface">
        {file ? <FileText aria-hidden className="size-5 text-ink-soft" /> : <UploadCloud aria-hidden className="size-5 text-ink-faint" />}
      </span>
      {file ? (
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-medium text-ink">{file.name}</span>
          <span className="text-[13px] text-ink-faint">{formatBytes(file.size)} · Click to change</span>
        </span>
      ) : (
        <span className="text-[15px] text-ink-soft">
          <span className="font-medium text-primary">Choose {noun}</span> or drag it here
        </span>
      )}
    </label>
  );
}
