import type { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-[4px] border border-white/[0.14] bg-white/[0.04] text-[11.5px] font-mono text-[var(--dark-text-secondary)] align-middle">
      {children}
    </kbd>
  );
}
