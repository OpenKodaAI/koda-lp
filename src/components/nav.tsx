"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KodaMark } from "@/components/ui/koda-mark";

const GITHUB_URL = "https://github.com/openkodaai/koda";
const NPM_URL = "https://www.npmjs.com/package/@openkodaai/koda";
const DOCS_URL = "/docs";

export function Nav() {
  const pathname = usePathname();
  const isDocsActive = pathname?.startsWith("/docs") ?? false;

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex h-11 items-center gap-0.5 rounded-full bg-black/65 backdrop-blur-xl border border-white/[0.08] px-2.5 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_10px_30px_rgba(0,0,0,0.45)]">
        <Link href="/" className="flex items-center gap-1.5 pr-2">
          <KodaMark variant="white" size={20} />
          <span className="text-[14px] font-semibold tracking-tight text-white">koda</span>
        </Link>

        <span aria-hidden className="mx-1 h-3.5 w-px bg-white/[0.12]" />

        <Link
          href={DOCS_URL}
          aria-current={isDocsActive ? "page" : undefined}
          className={`hidden sm:inline-flex h-8 items-center gap-1.5 px-2.5 rounded-full text-[12.5px] transition-colors ${
            isDocsActive
              ? "text-white bg-white/[0.06]"
              : "text-white/70 hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3.25 2.5h6.5l3 3v8h-9.5v-11z"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path d="M9.75 2.5v3h3" stroke="#ffffff" strokeWidth="1.3" strokeLinejoin="round" />
            <path
              d="M5.5 8.5h5M5.5 10.75h4"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Docs
        </Link>
        <Link
          href={NPM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex h-8 items-center gap-1.5 px-2.5 rounded-full text-[12.5px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 27.23 27.23" aria-hidden>
            <rect width="27.23" height="27.23" rx="2" fill="#ffffff" />
            <polygon
              points="5.8,21.75 13.61,21.75 13.61,9.59 17.52,9.59 17.52,21.75 21.43,21.75 21.43,5.68 5.8,5.68"
              fill="#000000"
            />
          </svg>
          npm
        </Link>
        <Link
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex h-8 items-center gap-1.5 px-2.5 rounded-full text-[12.5px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffffff" aria-hidden>
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.95.14 2.86.39 2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
          </svg>
          GitHub
        </Link>
      </div>
    </header>
  );
}
