"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { KodaMark } from "@/components/ui/koda-mark";
import { SearchPalette } from "./search-palette";

const GITHUB_URL = "https://github.com/openkodaai/koda";

export function DocsTopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const isModifier = event.metaKey || event.ctrlKey;
      if (isModifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (
        event.key === "/" &&
        !isModifier &&
        !event.altKey &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement) &&
        !(event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[rgba(12,12,12,0.82)] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="container-lp flex h-14 items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
            aria-label="Back to koda.dev"
          >
            <KodaMark variant="white" size={22} />
            <span className="text-[15px] font-semibold tracking-tight text-[var(--dark-text-primary)] group-hover:opacity-80 transition-opacity">
              koda
            </span>
            <span className="mx-0.5 h-4 w-px bg-white/[0.14]" aria-hidden />
            <span className="text-[14px] text-[var(--dark-text-tertiary)] group-hover:text-[var(--dark-text-secondary)] transition-colors">
              docs
            </span>
          </Link>

          <button
            type="button"
            onClick={openSearch}
            className="hidden md:flex items-center gap-2 flex-1 max-w-[360px] h-9 px-3 rounded-[10px] bg-white/[0.04] border border-white/[0.08] text-[13px] text-[var(--dark-text-tertiary)] hover:bg-white/[0.06] hover:border-white/[0.12] transition-colors ml-auto"
            aria-label="Search documentation"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span className="flex-1 text-left">Search docs</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 h-5 rounded-[4px] border border-white/[0.12] bg-white/[0.04] text-[10.5px] font-mono">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={openSearch}
            className="md:hidden ml-auto h-9 w-9 flex items-center justify-center rounded-[8px] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors text-[var(--dark-text-secondary)]"
            aria-label="Search documentation"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1 px-2.5 rounded-[8px] text-[13px] text-[var(--dark-text-tertiary)] hover:text-[var(--dark-text-primary)] hover:bg-white/[0.04] transition-colors"
            >
              Main site
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M6 4h6v6M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--dark-text-secondary)] hover:text-[var(--dark-text-primary)] hover:bg-white/[0.04] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.95.14 2.86.39 2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <SearchPalette open={searchOpen} onClose={closeSearch} />
    </>
  );
}
