"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSchoolName } from "@/lib/hooks/use-school-name";

const SEP = " — ";

/**
 * Appends the school's name to the browser tab title. Next writes its own
 * per-page title (e.g. "Dashboard · HealthConnect") shortly after mount,
 * which undoes a one-shot document.title write — so this watches the
 * <title> element and keeps reapplying the suffix whenever Next resets it.
 */
export function SchoolTitleSync() {
  const pathname = usePathname();
  const schoolName = useSchoolName();

  useEffect(() => {
    if (!schoolName) return;
    const suffix = `${SEP}${schoolName}`;
    const apply = () => {
      if (!document.title.endsWith(suffix)) {
        document.title = `${document.title.split(SEP)[0]}${suffix}`;
      }
    };
    apply();

    const titleEl = document.querySelector("title");
    if (!titleEl) return;
    const observer = new MutationObserver(apply);
    observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, schoolName]);

  return null;
}
