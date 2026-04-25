import Link from "next/link";
import { findPrevNext } from "@/lib/docs/nav";

export function PrevNext({ slug }: { slug: string }) {
  const { prev, next } = findPrevNext(slug);
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex flex-col gap-1 rounded-[12px] border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] p-4 transition-colors"
        >
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] font-mono text-[var(--dark-text-tertiary)]">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M13 8H3M7 4L3 8l4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Previous
          </div>
          <div className="text-[14.5px] font-medium text-[var(--dark-text-primary)] group-hover:opacity-95 transition-opacity">
            {prev.title}
          </div>
        </Link>
      ) : (
        <div aria-hidden />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-col gap-1 items-end rounded-[12px] border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] p-4 transition-colors text-right"
        >
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] font-mono text-[var(--dark-text-tertiary)]">
            Next
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-[14.5px] font-medium text-[var(--dark-text-primary)] group-hover:opacity-95 transition-opacity">
            {next.title}
          </div>
        </Link>
      ) : (
        <div aria-hidden />
      )}
    </nav>
  );
}
