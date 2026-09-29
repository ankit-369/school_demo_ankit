"use client";

import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { StudentAvatar } from "@/components/ui/student-avatar";
import { readFileAsDataUrl } from "@/lib/files";
import { useAppStore } from "@/lib/store/app-store";

const MAX_BYTES = 2 * 1024 * 1024;

/** The profile avatar itself, doubling as a "change photo" control when editing is allowed. */
export function PhotoUploadButton({ studentId, name, photoUrl, canEdit }: { studentId: string; name: string; photoUrl: string | null; canEdit: boolean }) {
  const updateStudent = useAppStore((s) => s.updateStudent);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Choose an image file");
    if (file.size > MAX_BYTES) return toast.error("Images must be 2 MB or smaller");
    setBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateStudent(studentId, { photoUrl: dataUrl }, "Photo updated");
      toast.success("Photo updated");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (!canEdit) return <StudentAvatar name={name} photoUrl={photoUrl} size="lg" />;

  return (
    <div className="relative shrink-0">
      <StudentAvatar name={name} photoUrl={photoUrl} size="lg" />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        aria-label="Change photo"
        className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-2 border-canvas bg-primary text-white shadow-soft transition-colors duration-150 hover:bg-primary/90 disabled:opacity-60"
      >
        <Camera aria-hidden className="size-3.5" />
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}
