"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { groupBySection, searchDocs, type SearchResult } from "@/lib/docs/search-index";

type SearchPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchPalette({ open, onClose }: SearchPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const results: SearchResult[] = query.trim() ? searchDocs(query) : [];
  const grouped = groupBySection(results);
  const flatResults: SearchResult[] = grouped.flatMap((g) => g.results);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
      lastFocusedRef.current?.focus?.();
    };
  }, [open]);

  const close = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (flatResults.length > 0) {
          setActiveIndex((i) => (i + 1) % flatResults.length);
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (flatResults.length > 0) {
          setActiveIndex((i) => (i - 1 + flatResults.length) % flatResults.length);
        }
      } else if (event.key === "Enter") {
        event.preventDefault();
        const active = flatResults[activeIndex];
        if (active) {
          const target = active.heading
            ? `/docs/${active.slug}#${active.heading.id}`
            : `/docs/${active.slug}`;
          router.push(target);
          close();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, flatResults, activeIndex, router]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[16vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-palette-title"
    >
      <h2 id="search-palette-title" className="sr-only">
        Search documentation
      </h2>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />
      <div className="relative w-full max-w-[600px] rounded-[14px] border border-white/[0.08] bg-[var(--dark-panel)] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-[var(--dark-text-tertiary)]">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation..."
            className="flex-1 min-w-0 bg-transparent text-[14px] text-[var(--dark-text-primary)] placeholder-[var(--dark-text-quaternary)] outline-none"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-palette-listbox"
            aria-activedescendant={
              flatResults[activeIndex]
                ? `search-result-${activeIndex}`
                : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 px-1.5 rounded-[4px] border border-white/[0.12] bg-white/[0.04] text-[10px] font-mono text-[var(--dark-text-tertiary)]">
            Esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <div className="px-4 py-10 text-center text-[13px] text-[var(--dark-text-tertiary)]">
              Type to search across all docs.
            </div>
          ) : flatResults.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13px] text-[var(--dark-text-tertiary)]">
              No results for{" "}
              <span className="font-mono text-[var(--dark-text-secondary)]">
                &ldquo;{query}&rdquo;
              </span>
            </div>
          ) : (
            <ul
              id="search-palette-listbox"
              role="listbox"
              aria-label="Search results"
              className="py-1"
            >
              {grouped.map((group) => (
                <li key={group.section} className="py-1">
                  <div className="px-4 pt-2 pb-1 text-[10.5px] font-mono uppercase tracking-[0.12em] text-[var(--dark-text-quaternary)]">
                    {group.section}
                  </div>
                  <ul>
                    {group.results.map((r) => {
                      const overallIndex = flatResults.indexOf(r);
                      const isActive = overallIndex === activeIndex;
                      const href = r.heading
                        ? `/docs/${r.slug}#${r.heading.id}`
                        : `/docs/${r.slug}`;
                      return (
                        <li
                          key={`${r.slug}-${r.heading?.id ?? ""}`}
                          role="option"
                          id={`search-result-${overallIndex}`}
                          aria-selected={isActive}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              router.push(href);
                              close();
                            }}
                            onMouseEnter={() => setActiveIndex(overallIndex)}
                            className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                              isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                            }`}
                          >
                            <div className="min-w-0">
                              <div
                                className={`text-[13.5px] font-medium truncate ${
                                  isActive
                                    ? "text-[var(--dark-text-primary)]"
                                    : "text-[var(--dark-text-secondary)]"
                                }`}
                              >
                                {r.heading ? `${r.title} › ${r.heading.text}` : r.title}
                              </div>
                              {r.description && !r.heading && (
                                <div className="mt-0.5 text-[12px] text-[var(--dark-text-tertiary)] truncate">
                                  {r.description}
                                </div>
                              )}
                            </div>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="none"
                              aria-hidden
                              className="shrink-0 text-[var(--dark-text-quaternary)]"
                            >
                              <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-2 border-t border-white/[0.06] text-[10.5px] font-mono text-[var(--dark-text-quaternary)]" aria-live="polite">
          <span>
            {query.trim() && `${flatResults.length} ${flatResults.length === 1 ? "result" : "results"}`}
          </span>
          <span className="flex items-center gap-2">
            <kbd className="inline-flex items-center gap-0.5 px-1 h-4 rounded border border-white/[0.12] bg-white/[0.04] text-[9.5px]">
              ↑↓
            </kbd>
            navigate
            <kbd className="inline-flex items-center gap-0.5 px-1 h-4 rounded border border-white/[0.12] bg-white/[0.04] text-[9.5px]">
              ↵
            </kbd>
            open
          </span>
        </div>
      </div>
    </div>
  );
}
