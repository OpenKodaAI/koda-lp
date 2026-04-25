"use client";

import { useEffect, useState } from "react";
import type { DocHeading } from "@/lib/docs/types";

export function OnThisPage({ headings }: { headings: DocHeading[] }) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -55% 0px",
        threshold: prefersReducedMotion ? 0 : [0, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <aside
      aria-label="On this page"
      className="hidden lg:block sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide"
    >
      <div className="mb-3 px-3 text-[11px] uppercase tracking-[0.14em] font-mono text-[var(--dark-text-tertiary)]">
        On this page
      </div>
      <ul className="flex flex-col gap-0.5">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`relative flex items-center h-7 px-3 rounded-[6px] text-[12.5px] transition-colors ${
                  h.level === 3 ? "pl-6" : ""
                } ${
                  isActive
                    ? "text-[var(--dark-text-primary)]"
                    : "text-[var(--dark-text-tertiary)] hover:text-[var(--dark-text-secondary)]"
                }`}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
                    style={{ background: "rgba(36, 102, 208, 0.9)" }}
                  />
                )}
                <span className="truncate">{h.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
