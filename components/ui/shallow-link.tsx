"use client";

import type { ComponentProps, MouseEvent } from "react";

/**
 * A real link (works with new-tab, copy-link, no-JS) that updates the query
 * string in place on a plain click — no server round-trip. Next syncs
 * useSearchParams with history.pushState, and Back/Forward just work.
 */
export function ShallowLink({ href, onClick, ...props }: ComponentProps<"a"> & { href: string }) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    window.history.pushState(null, "", href);
    window.scrollTo({ top: 0 });
  }
  return <a href={href} onClick={handleClick} {...props} />;
}
