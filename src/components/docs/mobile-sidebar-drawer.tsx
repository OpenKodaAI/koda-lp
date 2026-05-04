"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DocsSidebar } from "./docs-sidebar";

export function MobileSidebarDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  // Close when the route changes (user tapped a link inside the drawer)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + escape handler when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2.5 h-11 px-4 rounded-[10px] bg-white/[0.04] border border-white/[0.08] text-[14.5px] text-[var(--dark-text-secondary)] hover:bg-white/[0.06] hover:text-[var(--dark-text-primary)] transition-colors"
        aria-expanded={open}
        aria-controls="docs-mobile-drawer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
        </svg>
        Topics
      </button>

      {open && (
        <div
          id="docs-mobile-drawer"
          className="fixed inset-0 z-[55] flex"
          role="dialog"
          aria-modal="true"
          aria-label="Documentation topics"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xl" onClick={close} aria-hidden />
          <aside className="relative w-[min(360px,88vw)] h-full bg-[var(--dark-canvas)] border-r border-white/[0.06] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[12px] uppercase tracking-[0.14em] font-mono text-[var(--dark-text-tertiary)]">
                Topics
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close topics drawer"
                className="h-8 w-8 flex items-center justify-center rounded-[8px] hover:bg-white/[0.06] text-[var(--dark-text-tertiary)] hover:text-[var(--dark-text-primary)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <DocsSidebar onNavigate={close} />
          </aside>
        </div>
      )}
    </>
  );
}
